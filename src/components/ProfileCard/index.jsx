import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

// Services
import { addNewFollow, removeFollow } from "../../services/authServices"

// Components
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Avatar from "../Avatar"
import Button from "../Button"

// Styles
import "./index.scss"

function ProfileCard({ userInfo, error, hasActionButton, buttonOptions }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleFollow = useMutation({
    mutationFn: async ({ userToFollowId }) => {
      await addNewFollow(userToFollowId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["user-network-info"])
      await queryClient.invalidateQueries(["logged-user-info"])
      toast.success("Agora você está seguindo essa pessoa")
    },
    onError: () => {
      // console.log(error)
      toast.error("Erro ao adicionar seguidor")
    },
  })

  const handleUnfollow = useMutation({
    mutationFn: async ({ followerId }) => {
      await removeFollow(followerId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["user-network-info"])
      await queryClient.invalidateQueries(["logged-user-info"])
      toast.success("Você deixou de seguir essa pessoa")
    },
    onError: () => {
      // console.log(error)
      toast.error("Erro ao remover seguidor")
    },
  })

  function handleNavigateToProfile() {
    navigate(`/perfil/${userInfo._id}`)
  }

  return (
    <article className="profile-card">
      {error && <p>Erro ao carregar perfil</p>}
      {!error && (
        <>
          <button
            className="profile-card__avatar"
            onClick={handleNavigateToProfile}
          >
            <Avatar
              style={{ width: 65, height: 65 }}
              src={userInfo?.avatar}
              alt={userInfo?.name}
            />
          </button>
          <div className="profile-card__info">
            <p className="profile-card__name">{userInfo?.name}</p>

            <span
              className="profile-card__desc"
              title={
                userInfo?.headline
                  ? `Conteúdo: ${userInfo.headline}`
                  : "Sem headline"
              }
            >
              {userInfo?.headline ?? "-"}
            </span>
            <ul className="profile-card__indicators">
              <li>
                <p>Seguidores</p>
                <span>{userInfo?.followers ?? 0}</span>
              </li>
              <li>
                <p>Seguindo</p>
                <span>{userInfo.following ?? 0}</span>
              </li>
            </ul>
          </div>
          {hasActionButton && (
            <div style={{ marginTop: "auto" }}>
              <Button
                styleType={buttonOptions?.styleType}
                style={{ marginTop: "16px", height: "30px" }}
                isLoading={handleFollow.isLoading}
                onClick={
                  buttonOptions?.type === "follow"
                    ? () =>
                        handleFollow.mutate({ userToFollowId: userInfo._id })
                    : () => handleUnfollow.mutate({ followerId: userInfo._id })
                }
              >
                {buttonOptions?.title}
              </Button>
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default ProfileCard
