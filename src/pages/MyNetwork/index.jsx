import { useCallback, useRef, useState } from "react"
import { Lightbulb, UserCheck, UserCheck2, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Services
import {
  getNetworkUsers,
  getNetworkingUserInfo,
} from "../../services/authServices"

// Components
import Menu from "../../components/Menu"
import ProfileCard from "../../components/ProfileCard"
import Search from "../Jobs/components/Search"
import Button from "../../components/Button"
import Pagination from "../../components/Pagination"

// Styles
import "./index.scss"

const LIMIT = 25

function SkeletonUser() {
  return (
    <div className="skeleton-user">
      <div>
        <Skeleton
          count={1}
          style={{ width: 65, height: 65, borderRadius: "50%" }}
        />
      </div>
      <div>
        <div>
          <Skeleton count={1} style={{ width: 120, height: 35 }} />
        </div>
        <div>
          <Skeleton
            count={1}
            style={{ width: 140, height: 40, marginTop: 4 }}
          />
        </div>
      </div>
      <div>
        <div>
          <Skeleton count={1} style={{ width: 160, height: 20 }} />
        </div>
        <div>
          <Skeleton
            count={1}
            style={{ width: 160, height: 20, marginTop: 4 }}
          />
        </div>
      </div>
    </div>
  )
}

function SkeletonUsers() {
  return (
    <div className="skeleton-users">
      <SkeletonUser />
      <SkeletonUser />
      <SkeletonUser />
      <SkeletonUser />
      <SkeletonUser />
      <SkeletonUser />
      <SkeletonUser />
    </div>
  )
}

function MyNetwork() {
  const [type, setType] = useState("")

  const { page = 1, keyword = "" } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const { isLoading, data, error } = useQuery({
    queryKey: ["my-network", page, type, keyword],
    queryFn: () => fetchUsers(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  const {
    isLoading: isLoadingNetworkUser,
    data: dataNetworkingUser,
    error: errorNetworkingUser,
  } = useQuery({
    queryKey: ["user-network-info"],
    queryFn: () => fetchNetworkingInfo(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  async function fetchUsers() {
    try {
      const data = await getNetworkUsers({ page, limit: LIMIT, type, keyword })

      return data
    } catch (error) {
      console.error("Error fetching users: ", error)
      return []
    }
  }

  async function fetchNetworkingInfo() {
    try {
      const data = await getNetworkingUserInfo()

      return data
    } catch (error) {
      console.error("Error fetching users: ", error)
      return []
    }
  }

  const changePageNumber = useCallback(
    (pageNumber) => {
      if (keyword) {
        navigate(`/conexoes/${pageNumber}/${keyword}`)
        return
      }

      navigate(`/conexoes/${pageNumber}`)

      if (containerRef?.current) {
        containerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    },
    [keyword, navigate],
  )

  const handleChangeKeyword = useCallback(
    (value) => {
      if (keyword === value) return
      navigate(`/conexoes/${1}/${value}`)
    },
    [navigate, keyword],
  )

  function handleChangeType(value) {
    if (type === value) return

    setType(value)
    changePageNumber(1)
  }

  function defineButtonOptions(userSuggestion, loggedUser) {
    if (!loggedUser) return

    const { userNetwork } = loggedUser
    if (userNetwork.following?.includes(userSuggestion._id)) {
      return {
        styleType: "outlined",
        type: "unfollow",
        title: "Deixar de seguir",
      }
    }

    return {
      styleType: "contained",
      type: "follow",
      title: "Seguir",
    }
  }

  return (
    <div className="my-network">
      <div className="my-network__container">
        <Menu />
        <main className="my-network__main" ref={containerRef}>
          <Search
            placeholder="Pesquisa por usuários"
            initialValue=""
            onChange={handleChangeKeyword}
          />
          <div className="my-network__buttons">
            <Button
              styleType={type === "" ? "contained" : "outlined"}
              style={{ width: "fit-content" }}
              rightIcon={<Lightbulb size={16} />}
              onClick={() => handleChangeType("")}
            >
              Sugestões
            </Button>
            <Button
              styleType={type === "all" ? "contained" : "outlined"}
              style={{ width: "fit-content" }}
              rightIcon={<Users size={16} />}
              onClick={() => handleChangeType("all")}
            >
              Todos
            </Button>
            <Button
              styleType={type === "followers" ? "contained" : "outlined"}
              style={{ width: "fit-content" }}
              rightIcon={<UserCheck size={16} />}
              onClick={() => handleChangeType("followers")}
            >
              Seguidores
            </Button>
            <Button
              styleType={type === "following" ? "contained" : "outlined"}
              style={{ width: "fit-content" }}
              rightIcon={<UserCheck2 size={16} />}
              onClick={() => handleChangeType("following")}
            >
              Seguindo
            </Button>
          </div>
          <p className="my-network__list-title">Monte sua rede</p>
          {(isLoading || isLoadingNetworkUser) && <SkeletonUsers />}
          {(error || errorNetworkingUser) && (
            <p>Houve um problema ao listar usuários</p>
          )}
          {!isLoading && _.isEmpty(data?.users) && (
            <p>Nenhum usuário encontrado</p>
          )}
          {!isLoading && (
            <div className="my-network__users-list">
              {data?.users?.map((user) => (
                <ProfileCard
                  key={user._id}
                  userInfo={user}
                  hasActionButton
                  buttonOptions={defineButtonOptions(user, dataNetworkingUser)}
                />
              ))}
            </div>
          )}
          <footer>
            {!isLoading && data?.total > 0 && !error && (
              <Pagination
                currentPage={page}
                onClickAction={changePageNumber}
                totalPages={data?.total ? Math.ceil(data?.total / LIMIT) : 1}
              />
            )}
          </footer>
        </main>
      </div>
    </div>
  )
}

export default MyNetwork
