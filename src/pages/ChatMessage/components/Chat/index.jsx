import { useEffect, useRef, useState } from "react"
import { MessagesSquare } from "lucide-react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { Discuss } from "react-loader-spinner"
import Skeleton from "react-loading-skeleton"

// Custom hooks
import { useMedia } from "../../../../hooks/useMedia"

// Services
import { getMessages, sendMessage } from "../../../../services/messageService"

// Utils
import { parseLocalStorageJson } from "../../../../utils"

// Components
import Avatar from "../../../../components/Avatar"
import Message from "../Message"
import InputMessage from "../InputMessage"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function SkeletonMessage({ orientation = "left", messageWidth = 120 }) {
  function returnClassName() {
    let className = "chat__skeleton-message"
    if (orientation === "right") className += " chat__skeleton-message--right"

    return className
  }

  return (
    <div className={returnClassName()}>
      <div>
        <Skeleton
          count={1}
          style={{ width: 45, height: 45, borderRadius: "50%" }}
        />
      </div>
      <div>
        <Skeleton count={1} style={{ width: messageWidth, height: 30 }} />
      </div>
    </div>
  )
}

function SkeletonChat() {
  const isMobile = useMedia("(max-width: 480px)")

  return (
    <div className="skeleton-chat">
      <SkeletonMessage messageWidth={isMobile ? 140 : 180} />
      <SkeletonMessage messageWidth={isMobile ? 80 : 120} />
      <SkeletonMessage messageWidth={isMobile ? 120 : 140} />
      <SkeletonMessage orientation="right" messageWidth={isMobile ? 80 : 120} />
      <SkeletonMessage
        orientation="right"
        messageWidth={isMobile ? 140 : 190}
      />
    </div>
  )
}

function Chat({ conversationId, receiver }) {
  const user = parseLocalStorageJson("diversiFindUser")
  const queryClient = useQueryClient()

  const [resetValue, setResetValue] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [initialView, setInitialView] = useState(true)

  const messagesContainerRef = useRef(null)
  const lastMessageRef = useRef(null)

  const {
    isLoading,
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: ({ pageParam = 1 }) => fetchMessages(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length < lastPage?.totalPages) {
        return allPages.length + 1
      }

      return undefined
    },
    staleTime: Infinity,
    enabled: !!conversationId,
    refetchOnWindowFocus: true,
    keepPreviousData: false,
    retry: false,
  })

  useEffect(() => {
    if (resetValue) {
      setResetValue(false)
    }
  }, [resetValue])

  useEffect(() => {
    const currentEl = messagesContainerRef.current

    if (currentEl) {
      const { offsetHeight, scrollHeight, scrollTop } = currentEl

      // Scroll to the bottom of the chat when the scrollTop is smaller than 25% of scrollHeight
      if (
        data?.pages.length > 1 &&
        currentEl.scrollTop <= currentEl.scrollHeight * 0.25
      ) {
        currentEl.scrollTo(0, currentEl.scrollHeight * 0.25)
      }

      if (data?.pages.length === 1) {
        currentEl.scrollTop = currentEl.scrollHeight
      }

      if (!initialView && scrollHeight <= scrollTop + offsetHeight + 130) {
        currentEl.scrollTop = currentEl.scrollHeight
      }

      setInitialView(false)
    }
  }, [data, initialView])

  /* Load previous messages */
  useEffect(() => {
    function infiniteScroll() {
      const scroll = messagesContainerRef.current?.scrollHeight
      const scrollTop = messagesContainerRef.current?.scrollTop

      if (scrollTop <= scroll * 0.25 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    window.addEventListener("scroll", infiniteScroll)
    window.addEventListener("wheel", infiniteScroll)

    return () => {
      window.removeEventListener("scroll", infiniteScroll)
      window.removeEventListener("wheel", infiniteScroll)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const currentEl = messagesContainerRef.current
    if (conversationId && currentEl) {
      currentEl.scrollTop = currentEl.scrollHeight
    }
  }, [conversationId])

  async function fetchMessages(pageParam) {
    try {
      const data = await getMessages(conversationId, pageParam)

      return data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async function submitMessage(message) {
    try {
      setIsSending(true)
      const newMessage = await sendMessage(receiver._id, message)

      queryClient.setQueryData(
        ["conversation-messages", newMessage.conversationId],
        (oldData) => {
          if (oldData && oldData.pages.length > 0) {
            let newFirstPage = [newMessage, ...oldData.pages[0].messages]
            let newData = [
              {
                messages: newFirstPage,
                totalPages: oldData.pages[0].totalPages,
              },
              ...oldData.pages.slice(1),
            ]

            return { pages: newData, pageParams: oldData.pageParams }
          }

          let newFirstPage = [{ messages: [newMessage], totalPages: 1 }]

          return { pages: newFirstPage, pageParams: oldData.pageParams }
        },
      )

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      })
      setTimeout(() => {
        const currentEl = messagesContainerRef.current
        currentEl.scrollTo({ top: currentEl.scrollHeight, behavior: "smooth" })
      }, 100)
      setResetValue(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  function defineRef({ pageIndex, messageIndex, totalMessagesOfPage }) {
    if (pageIndex === 0 && messageIndex === totalMessagesOfPage - 1) {
      return lastMessageRef
    }

    return null
  }

  return (
    <main className="chat">
      {receiver ? (
        <>
          <header>
            <Avatar
              src={receiver.avatar}
              alt={`Foto de perfil do usuário(a) ${receiver.name}`}
            />
            <div>
              <h4>{receiver.name}</h4>
              <p>{receiver.headline ?? "-"}</p>
            </div>
          </header>
          <div className="chat__divider" />
          <main className="chat__main" ref={messagesContainerRef}>
            {isFetchingNextPage && (
              <div className="chat__main__loader">
                <Discuss
                  visible={true}
                  height="48"
                  width="48"
                  ariaLabel="discuss-loading"
                  wrapperStyle={{}}
                  wrapperClass="discuss-wrapper"
                />
              </div>
            )}
            <div className="chat__messages-container">
              {isLoading && <SkeletonChat />}
              {!isLoading && error && <p>Erro ao buscar mensagens</p>}
              {!isLoading &&
                data?.pages.map((page, pageIndex) =>
                  page.messages?.map((message, index) => (
                    <Message
                      key={message._id}
                      ref={defineRef({
                        pageIndex,
                        totalPages: data.pages.length,
                        messageIndex: index,
                        totalMessagesOfPage: page.messages.length,
                      })}
                      message={message}
                      userId={user._id}
                    />
                  )),
                )}
            </div>
          </main>
          <div className="chat__divider" />
          <footer>
            <InputMessage
              resetValue={resetValue}
              isSending={isSending}
              submitMessage={submitMessage}
            />
          </footer>
        </>
      ) : (
        <div className="chat__empty-container">
          <p>Selecione um chat para iniciar uma conversa</p>
          <MessagesSquare size={48} />
        </div>
      )}
    </main>
  )
}

export default Chat
