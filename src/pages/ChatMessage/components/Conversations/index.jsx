import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Utils
import { getPassedtime } from "../../../../utils"

// Services
import { getConversations } from "../../../../services/messageService"

// Components
import { useQuery } from "@tanstack/react-query"
import Avatar from "../../../../components/Avatar"
import SearchBar from "../SearchBar"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function SkeletonConversation() {
  return (
    <div className="skeleton-conversation">
      <div>
        <Skeleton
          count={1}
          style={{ width: 45, height: 45, borderRadius: "50%" }}
        />
      </div>
      <div>
        <Skeleton count={1} style={{ width: 150, height: 25 }} />
        <Skeleton count={1} style={{ width: 90, height: 10 }} />
      </div>
    </div>
  )
}

function SkeletonConversations() {
  return (
    <div className="skeleton-conversations">
      <SkeletonConversation />
      <SkeletonConversation />
      <SkeletonConversation />
      <SkeletonConversation />
    </div>
  )
}

function Conversations({
  searchBarBg = "fff",
  withTitle = false,
  selectedConversation,
  setSelectedConversation,
}) {
  const [keyword, setKeyword] = useState("")
  const { conversationId: defaultConversation } = useSelector(
    (state) => state.app,
  )
  const dispatch = useDispatch()

  const { isLoading, data, error } = useQuery({
    queryKey: ["conversations", keyword],
    queryFn: () => fetchConversations(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: "always",
    keepPreviousData: true,
    retry: false,
  })

  async function fetchConversations() {
    try {
      const data = await getConversations(keyword)
      if (defaultConversation) {
        const selectedConversation = data?.conversations.filter(
          (conversation) => conversation.conversationId === defaultConversation,
        )

        setSelectedConversation(selectedConversation[0])
        dispatch({
          type: "CHANGE_CONVERSATION_ID",
          payload: "",
        })
      }

      return data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  function handleChangeKeyword(value) {
    if (value === keyword) return

    setKeyword(value)
  }

  function defineLastMessagePassedTime(conversation) {
    if (!conversation) return ""

    if (conversation?.lastMessage.createdAt) {
      return getPassedtime(conversation?.lastMessage.createdAt)
    }

    return ""
  }

  function returnConversationItemClassName(conversation) {
    let className = "conversations__conversation-item"
    if (selectedConversation?.conversationId === conversation.conversationId) {
      className += " conversations__conversation-item--active"
    }

    return className
  }

  return (
    <aside className="conversations">
      <header>
        {withTitle && <h1>Conversas</h1>}
        <SearchBar
          bgColor={searchBarBg}
          initialValue={keyword}
          onChange={handleChangeKeyword}
        />
      </header>
      {isLoading && <SkeletonConversations />}
      {error && <p>Erro ao buscar conversas</p>}
      {!isLoading && _.isEmpty(data?.conversations) && (
        <p>Nenhuma conversa encontrada</p>
      )}
      {!isLoading && !_.isEmpty(data?.conversations) && (
        <ul className="conversations__list">
          {data.conversations.map((conversation) => {
            return (
              <li
                key={conversation.conversationId}
                className={returnConversationItemClassName(conversation)}
              >
                <button onClick={() => setSelectedConversation(conversation)}>
                  <Avatar
                    src={conversation.receiver.avatar}
                    alt={`Foto de perfil do usuário(a) ${conversation.receiver.name}`}
                  />
                  <div className="conversations__user-info">
                    <header>
                      <h2>{conversation.receiver.name}</h2>
                      <p className="conversations__time">
                        {defineLastMessagePassedTime(conversation)}
                      </p>
                    </header>
                    <p>{conversation?.lastMessage.content}</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}

export default Conversations
