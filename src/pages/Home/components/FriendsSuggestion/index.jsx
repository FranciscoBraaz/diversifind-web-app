// import { UserPlus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Components
import Avatar from "../../../../components/Avatar"

// Services
import { getSuggestions } from "../../../../services/authServices"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function SekeletonUser() {
  return (
    <div className="skeleton-friends-suggestion">
      <div>
        <Skeleton
          count={1}
          style={{ width: 45, height: 45, borderRadius: "50%" }}
        />
      </div>
      <div>
        <Skeleton count={1} style={{ width: "60%", height: 25 }} />
        <Skeleton count={1} style={{ width: "80%", height: 15 }} />
      </div>
    </div>
  )
}

function SkeletonUsers() {
  return (
    <div className="skeleton-friends-suggestion__container">
      <SekeletonUser />
      <SekeletonUser />
      <SekeletonUser />
      <SekeletonUser />
    </div>
  )
}

function Friend({ friendSuggestion, onClick }) {
  return (
    <li className="friends-suggestion__item">
      <button onClick={onClick}>
        <Avatar
          src={friendSuggestion.avatar}
          alt={`Conteúdo: ${friendSuggestion.name}`}
        />
        <div>
          <h2 title={`Conteúdo: ${friendSuggestion.name}`}>
            {friendSuggestion.name}
          </h2>
          <p
            title={
              friendSuggestion.headline
                ? `Conteúdo: ${friendSuggestion.headline}`
                : "Sem headline"
            }
          >
            {friendSuggestion.headline ?? "-"}
          </p>
        </div>
      </button>
    </li>
  )
}
Friend.displayName = "Friend"

function FriendsSuggestion() {
  const navigate = useNavigate()
  const { isLoading, data, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => fetchSuggestions(),
    staleTime: 90,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
  })

  async function fetchSuggestions() {
    try {
      const data = await getSuggestions()
      if (!_.isEmpty(data?.users)) return data.users

      return []
    } catch (error) {
      toast.error("Erro ao buscar sugestões")
      return []
    }
  }

  function handleNavigateToProfile(id) {
    navigate(`/perfil/${id}`)
  }

  return (
    <section className="friends-suggestion">
      <h1>Sugestões</h1>
      {isLoading && <SkeletonUsers />}
      {error && <p>Houve um erro ao trazer as sugestões</p>}
      {!isLoading && _.isEmpty(data) && <p>Não há sugestões no momento</p>}
      {!isLoading && !_.isEmpty(data) && (
        <ul>
          {data.map((friendSuggestion, index) => (
            <Friend
              key={index}
              friendSuggestion={friendSuggestion}
              onClick={() => handleNavigateToProfile(friendSuggestion._id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default FriendsSuggestion
