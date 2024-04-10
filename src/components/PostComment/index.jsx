import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import { MoreVertical } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Services
import { deleteComment, editComment } from "../../services/postServices"

// Components
import Button from "../Button"
import UnlimitedTextarea from "../UnlimitedTextarea"
import Dropdown from "../Dropdown"
import Avatar from "../Avatar"
import ConfirmationModal from "../ConfirmationModal"

// Styles
import "./index.scss"

export function PostComment({
  comment,
  userIsAuthor = false,
  postId,
  commentId,
  page,
  refetch,
  decreaseCommentsCount,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [inputValue, setInputValue] = useState(comment.content)

  const dropdownOptions = [
    {
      label: "Excluir",
      icon: "Trash2",
      action: () => setShowDeleteModal(true),
    },
    {
      label: "Editar",
      icon: "Pencil",
      action: () => setIsEditing(true),
    },
  ]

  useEffect(() => {
    if (isEditing) {
      const textArea = document.getElementById("comment-text")
      if (textArea) {
        textArea.focus()
      }
    }
  }, [isEditing])

  const handleDeleteComment = useMutation({
    mutationFn: async ({ commentId, page }) => {
      await deleteComment(commentId, postId)

      return { pageIndex: page }
    },
    onSuccess: async ({ pageIndex }) => {
      await refetch({ refetchPage: (page, index) => index === pageIndex })
      decreaseCommentsCount()
      setShowDeleteModal(false)
      toast.success("Comentário apagado")
    },
    onError: (error) => {
      console.log("Erro ao apagar comentário", error)
      toast.error("Erro ao apagar comentário")
    },
  })

  const handleEditComment = useMutation({
    mutationFn: async ({ commentId, page, content }) => {
      await editComment(commentId, content.trim())

      return { pageIndex: page }
    },
    onSuccess: async ({ pageIndex }) => {
      await refetch({ refetchPage: (page, index) => index === pageIndex })
      setIsEditing(false)
      toast.success("Comentário editado")
    },
    onError: (error) => {
      console.log("Erro ao editar comentário", error)
      toast.error("Erro ao editar comentário")
    },
  })

  function handleCancelEdit() {
    setInputValue(comment.content)
    setIsEditing(false)
  }

  return (
    <div className="comment">
      <Avatar src={comment.user.avatar} alt={comment.user.name} />
      <div className="comment__area">
        <header>
          <div>
            <span className="comment__author-name">{comment.user.name}</span>
            <span className="comment__author-description">
              {comment.user.headline || "-"}
            </span>
          </div>
          {userIsAuthor && (
            <Dropdown options={dropdownOptions} width={120}>
              <MoreVertical />
            </Dropdown>
          )}
        </header>

        {isEditing ? (
          <div className="comment__edit-area">
            <UnlimitedTextarea
              value={inputValue ?? ""}
              shouldFocus
              onChangeValue={(value) => setInputValue(value)}
              name="comment-text"
              id="comment-text"
              placeholder="Edite seu comentário..."
            />
            <footer>
              <Button
                type="button"
                onClick={
                  inputValue
                    ? () =>
                        handleEditComment.mutate({
                          commentId,
                          page,
                          content: inputValue,
                        })
                    : undefined
                }
                styleType="contained"
                disabled={!inputValue || handleEditComment.isLoading}
                style={{
                  height: 26,
                  width: "fit-content",
                  fontSize: 14,
                  lineHeight: "26px",
                }}
              >
                {handleEditComment.isLoading ? (
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Salvar alterações"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleCancelEdit}
                disabled={handleEditComment.isLoading}
                styleType="outlined"
                style={{
                  height: 26,
                  width: "fit-content",
                  fontSize: 14,
                  lineHeight: "26px",
                }}
              >
                Cancelar
              </Button>
            </footer>
          </div>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>
      <ConfirmationModal
        open={showDeleteModal}
        type="delete"
        options={{
          title: "Excluir comentário",
          descriptionText: "Tem certeza que deseja excluir este comentário?",
          confirmText: "Excluir",
        }}
        actionIsLoading={handleDeleteComment.isLoading}
        onCloseModal={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteComment.mutate({ commentId, page })}
      />
    </div>
  )
}
