import { useEffect, useState } from "react"
import { Heart, MessageSquare, MoreVertical } from "lucide-react"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useTransition, animated } from "@react-spring/web"
import { toast } from "react-toastify"
import Skeleton from "react-loading-skeleton"

// Services
import {
  addComment,
  addLike,
  deletePost,
  getCommentsFromPost,
  removeLike,
} from "../../services/postServices"

// Utils
import { getPassedtime, parseLocalStorageJson } from "../../utils"

// Components
import { PostComment } from "../PostComment"
import Avatar from "../Avatar"
import TextArea from "../Textarea"
import Dropdown from "../Dropdown"
import ConfirmationModal from "../ConfirmationModal"
import PostForm from "../PostForm"

// Styles
import "./index.scss"
import { Link } from "react-router-dom"

function SkeletonComment() {
  return (
    <div className="skeleton-comment">
      <Skeleton
        count={1}
        style={{ width: 45, height: 45, borderRadius: "50%" }}
      />
      <div className="skeleton-comment__area">
        <Skeleton
          count={1}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            borderTopLeftRadius: 0,
          }}
        />
      </div>
    </div>
  )
}

function AddComment({ postId, increaseCommentsCount }) {
  const queryClient = useQueryClient()
  const user = parseLocalStorageJson("diversiFindUser")

  const [commentText, setCommentText] = useState("")
  const [showSubmitButton, setShowSubmitButton] = useState(false)
  const transition = useTransition(showSubmitButton, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
  })

  useEffect(() => {
    if (commentText.length > 0) {
      setShowSubmitButton(true)
    } else {
      setShowSubmitButton(false)
    }
  }, [commentText])

  async function submitComment(e) {
    e.preventDefault()
    try {
      let { comment } = await addComment(postId, commentText.trim())
      comment = { ...comment, user }
      queryClient.setQueryData(["post-comments", postId], (oldData) => {
        if (oldData && oldData.pages.length > 0) {
          let newFirstPage = [comment, ...oldData.pages[0].comments]
          let newData = [
            { comments: newFirstPage, totalPages: oldData.pages[0].totalPages },
            ...oldData.pages.slice(1),
          ]

          return { pages: newData, pageParams: oldData.pageParams }
        }

        let newFirstPage = { comments: [comment], total: 1 }

        return { pages: newFirstPage, pageParams: oldData.pageParams }
      })

      increaseCommentsCount()
      setCommentText("")
      toast.success("Comentário enviado")
    } catch (error) {
      toast.success("Erro interno do servidor")
    }
  }

  return (
    <form className="form-comment" onSubmit={submitComment}>
      <div className="add-comment">
        <Avatar src={user.avatar} alt={user.name} />
        <TextArea
          id="comment-textarea"
          name="comment"
          placeholder="Adicionar comentário"
          required
          value={commentText}
          onChange={(value) => setCommentText(value)}
        />
      </div>
      {transition(
        (style, item) =>
          item && (
            <animated.button
              style={style}
              type="submit"
              className="form-comment__button-submit"
            >
              Publicar
            </animated.button>
          ),
      )}
    </form>
  )
}

function Comments({
  comments,
  postId,
  pageIndex,
  user,
  refetch,
  decreaseCommentsCount,
}) {
  const transitions = useTransition(comments, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    // leave: { opacity: 0 },
    keys: (comment) => comment._id,
  })
  return (
    <>
      {transitions((style, comment) => (
        <animated.div key={comment._id} style={style}>
          <PostComment
            comment={comment}
            userIsAuthor={user._id === comment.user._id}
            commentId={comment._id}
            postId={postId}
            page={pageIndex}
            refetch={refetch}
            decreaseCommentsCount={decreaseCommentsCount}
          />
        </animated.div>
      ))}
    </>
  )
}

function CommentarySection({
  user,
  postId,
  commentsPages = [],
  commentsIsLoading,
  commentsError,
  hasNextPage,
  isFetchingNextPage,
  loadMoreComments,
  increaseCommentsCount,
  decreaseCommentsCount,
  refetch,
}) {
  return (
    <div className="commentary-section">
      <AddComment
        postId={postId}
        increaseCommentsCount={increaseCommentsCount}
      />
      {commentsIsLoading && <SkeletonComment />}
      {!commentsIsLoading && commentsError && (
        <p>Não foi possível carregar os comentários</p>
      )}
      {!commentsIsLoading && !commentsError && (
        <div className="commentary-section__comments">
          {commentsPages.map((commentPage, pageIndex) => (
            <Comments
              key={pageIndex}
              comments={commentPage.comments}
              user={user}
              postId={postId}
              pageIndex={pageIndex}
              refetch={refetch}
              decreaseCommentsCount={decreaseCommentsCount}
            />
          ))}
        </div>
      )}
      {isFetchingNextPage && <SkeletonComment />}
      {hasNextPage && (
        <button
          className="commentary-section__show-more"
          onClick={loadMoreComments}
        >
          Mostrar mais comentários
        </button>
      )}
    </div>
  )
}

function Post({
  author,
  src,
  content,
  mediaDescription,
  cloudinaryId,
  createdAt,
  postId,
  pageIndex,
  postIndex,
  postReactions,
}) {
  const user = parseLocalStorageJson("diversiFindUser")
  const { likes, comments } = postReactions
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [likesCount, setLikesCount] = useState(likes.length)
  const [postLiked, setPostLiked] = useState(likes.includes(user._id))
  const [commentsCount, setCommentsCount] = useState(comments.length)
  const [showComments, setShowComments] = useState(false)
  const [focusInput, setFocusInput] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const queryClient = useQueryClient()

  const dropdownOptions = [
    {
      label: "Apagar",
      icon: "Trash2",
      action: () => setShowDeleteModal(true),
    },
    {
      label: "Editar",
      icon: "Pencil",
      action: () => setShowEditModal(true),
    },
  ]

  const {
    isLoading: commentsIsLoading,
    data: commentsData,
    error: commentsError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["post-comments", postId],
    queryFn: ({ pageParam = 1 }) => fetchPostComments(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length < lastPage.totalPages) {
        return allPages.length + 1
      }

      return undefined
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    enabled: showComments,
    retry: false,
  })

  useEffect(() => {
    const input = document.getElementById("comment-textarea")
    if (focusInput && input) {
      input.focus()
    }
  }, [focusInput])

  async function fetchPostComments(pageParam) {
    try {
      const { comments, totalPages } = await getCommentsFromPost(
        postId,
        pageParam,
      )

      return { comments, totalPages }
    } catch (error) {
      // console.log(error)
      return []
    }
  }

  const handleDeletePost = useMutation({
    mutationFn: async ({ postId, pageIndex, postIndex }) => {
      await deletePost(postId)

      return { pageIndex, postIndex }
    },
    onSuccess: ({ pageIndex, postIndex }) => {
      queryClient.setQueryData(["feed"], (oldData) => {
        const beforePages = oldData.pages.slice(0, pageIndex)
        const afterPages = oldData.pages.slice(pageIndex + 1)
        let currentPage = oldData.pages[pageIndex]

        currentPage = {
          ...currentPage,
          posts: currentPage.posts.filter((_, index) => index !== postIndex),
        }

        return {
          ...oldData,
          pages: [...beforePages, currentPage, ...afterPages],
        }
      })
      toast.success("Postagem excluída")
      setShowDeleteModal(false)
    },
    onError: () => {
      // console.log(error)
      toast.error("Erro ao excluir postagem")
    },
  })

  function handleOpenCommentsSection(shouldFocus = false) {
    setShowComments(true)

    if (shouldFocus) {
      setFocusInput(true)
    }
  }

  async function handleAddLike() {
    try {
      await addLike(postId)
      setLikesCount(likesCount + 1)
      setPostLiked(true)
    } catch (error) {
      // console.log(error)
    }
  }

  async function handleDeslike() {
    try {
      await removeLike(postId)
      setLikesCount(likesCount - 1)
      setPostLiked(false)
    } catch (error) {
      // console.log(error)
    }
  }

  function increaseCommentsCount() {
    setCommentsCount((prevComments) => prevComments + 1)
  }

  function decreaseCommentsCount() {
    setCommentsCount((prevComments) => prevComments - 1)
  }

  function returnLikeButtonClassName() {
    let className = "post__actions__like"

    if (postLiked) {
      className += " post__actions__like--liked"
    }

    return className
  }

  const userIsPostOwner = user._id === author._id

  return (
    <article className="post">
      <header>
        <Avatar
          src={author.avatar}
          alt={`${author.name} é o autor e este é o ${postIndex + 1} do feed`}
        />
        <div className="post__user-info">
          <Link to={`/perfil/${author._id}`} className="post__user-info__name">
            {author.name}
          </Link>
          <span className="post__user-info__desc">
            {author.headline || "-"}
          </span>
          <span className="post__user-info__time">
            {getPassedtime(createdAt)}
          </span>
          {userIsPostOwner && (
            <Dropdown
              options={dropdownOptions}
              width={120}
              buttonLabel="Abrir ações da publicação"
            >
              <MoreVertical />
            </Dropdown>
          )}
        </div>
      </header>
      <section className="post__content">
        <p>{content}</p>
        <div className="post__content__container-media">
          {src && isImageLoading && (
            <div>
              <Skeleton />
            </div>
          )}
          {src && (
            <img
              src={src}
              width="600"
              alt={mediaDescription ?? `Imagem da ${postIndex + 1} publicação`}
              style={
                isImageLoading
                  ? { opacity: 0, visibility: "hidden", height: 0 }
                  : { opacity: 1, visibility: "visible" }
              }
              onLoad={() => setIsImageLoading(false)}
            />
          )}
        </div>
        <div className="post__reactions">
          <div>
            <Heart />
            <span>{likesCount} curtidas</span>
          </div>
          <button
            type="button"
            onClick={() => handleOpenCommentsSection(false)}
          >
            <MessageSquare />
            <span>{commentsCount} comentários</span>
          </button>
        </div>
      </section>
      <footer className="post__actions">
        <div className="post__actions__buttons">
          <button
            onClick={postLiked ? handleDeslike : handleAddLike}
            type="button"
            className={returnLikeButtonClassName()}
          >
            <Heart /> Curtir
          </button>
          <button
            type="button"
            onClick={() => handleOpenCommentsSection(true)}
            className="post__actions__comment"
          >
            <MessageSquare /> Comentar
          </button>
        </div>
        {showComments && (
          <CommentarySection
            user={user}
            commentsPages={commentsData?.pages}
            commentsIsLoading={commentsIsLoading}
            commentsError={commentsError}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            postId={postId}
            loadMoreComments={fetchNextPage}
            increaseCommentsCount={increaseCommentsCount}
            decreaseCommentsCount={decreaseCommentsCount}
            refetch={refetch}
          />
        )}
      </footer>
      <ConfirmationModal
        open={showDeleteModal}
        type="delete"
        options={{
          title: "Excluir postagem",
          descriptionText: "Tem certeza que deseja excluir esta postagem?",
          confirmText: "Excluir",
        }}
        actionIsLoading={handleDeletePost.isLoading}
        onCloseModal={() => setShowDeleteModal(false)}
        onConfirm={() =>
          handleDeletePost.mutate({ postId, pageIndex, postIndex })
        }
      />
      <PostForm
        text={content}
        textImgDescription={mediaDescription}
        sourceUrl={src}
        isEditing
        postId={postId}
        pageIndex={pageIndex}
        postIndex={postIndex}
        cloudinaryId={cloudinaryId}
        modalIsOpen={showEditModal}
        setModalIsOpen={setShowEditModal}
      />
    </article>
  )
}

export default Post
