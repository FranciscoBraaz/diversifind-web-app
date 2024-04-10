import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Services
import { getCommunitiesByAuthor } from "../../services/communityService"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Components
import Menu from "../../components/Menu"
import Search from "../Jobs/components/Search"
import Pagination from "../../components/Pagination"
import CommunityCard from "../Communities/components/CommunityCard"
import DialogFilters from "../Communities/components/DialogFilters"
import Filters from "../Communities/components/Filters"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

const LIMIT = 20

function SkeletonCommunityCard({ isLast }) {
  function returnClassName() {
    let className = "skeleton-job-card"
    if (isLast) className += " skeleton-job-card--last"

    return className
  }

  return (
    <div className={returnClassName()}>
      <header>
        <div className="skeleton-community-card__inner-header-container">
          <Skeleton count={1} style={{ width: "60%", height: 30 }} />
          <div>
            <div>
              <Skeleton count={1} style={{ width: 60, height: 20 }} />
            </div>
            <div>
              <Skeleton count={1} style={{ width: 60, height: 20 }} />
            </div>
          </div>
        </div>
        <div>
          <Skeleton count={1} style={{ width: 50, height: 20 }} />
        </div>
      </header>
      <main>
        <Skeleton count={1} style={{ width: "100%", height: 140 }} />
      </main>
      <footer>
        <div>
          <Skeleton count={1} style={{ width: "60%", height: 25 }} />
        </div>
        <div>
          <Skeleton count={1} style={{ width: 140, height: 40 }} />
        </div>
      </footer>
    </div>
  )
}

function SkeletonBody() {
  return (
    <div className="communities__skeleton-body">
      <header>
        <div>
          <Skeleton count={1} style={{ width: 100, height: 35 }} />
        </div>
        <div>
          <Skeleton count={1} style={{ width: 120, height: 35 }} />
        </div>
      </header>
      <section>
        <SkeletonCommunityCard />
        <SkeletonCommunityCard />
        <SkeletonCommunityCard isLast />
      </section>
    </div>
  )
}

function MyCommunities() {
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  const { page = 1, keyword = "" } = useParams()
  const isMobile = useMedia("(max-width: 960px)")
  const user = parseLocalStorageJson("diversiFindUser")
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const methods = useForm({
    defaultValues: {
      sortType: "recent",
      professionalArea: "",
      whatsapp: false,
      telegram: false,
      discord: false,
      facebook: false,
      reddit: false,
      linkedin: false,
    },
  })
  const { watch } = methods

  const { isLoading, data, error } = useQuery({
    queryKey: ["my-communities", page, keyword, filters],
    queryFn: () => fetchCommunities(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  const changePageNumber = useCallback(
    (pageNumber) => {
      if (keyword) {
        navigate(`/comunidades/minhas-comunidades/${pageNumber}/${keyword}`)
        return
      }

      navigate(`/comunidades/minhas-comunidades/${pageNumber}`)

      if (containerRef?.current) {
        containerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    },
    [keyword, navigate],
  )

  useEffect(() => {
    const subscription = watch((value) => {
      setFilters(value)
      changePageNumber(1)
    })
    return () => subscription.unsubscribe()
  }, [watch, changePageNumber])

  async function fetchCommunities() {
    try {
      let newFilters = { ...filters }
      if (!_.isEmpty(newFilters)) {
        const platformsKeys = Object.keys(newFilters["platforms"])
        newFilters["platforms"] = platformsKeys.filter(
          (key) => newFilters["platforms"][key],
        )
      }

      const data = await getCommunitiesByAuthor({
        page,
        limit: LIMIT,
        keyword,
        filters: newFilters,
      })
      return data
    } catch (error) {
      console.error("Error fetching vacancies: ", error)
      return []
    }
  }

  const handleChangeKeyword = useCallback(
    (value) => {
      if (keyword === value) return
      navigate(`/comunidades/minhas-comunidades/${1}/${value}`)
    },
    [navigate, keyword],
  )

  return (
    <div className="my-communities">
      <div className="my-communities-container">
        <Menu />
        <main className="my-communities__main" ref={containerRef}>
          <header className="my-communities__header">
            <h2>Gerencie as vagas que você cadastrou na plataforma</h2>
            <Search initialValue={keyword} onChange={handleChangeKeyword} />
          </header>
          <section className="my-communities__cards">
            {isLoading && <SkeletonBody />}
            {_.isEmpty(data?.communities) && !error && (
              <p>Nenhuma vaga encontrada</p>
            )}
            {!_.isEmpty(data?.communities) &&
              data.communities.map((community, index) => (
                <div key={community._id}>
                  <CommunityCard
                    community={community}
                    isOwner={user._id === community.author}
                  />
                  {index < data.communities.length - 1 && (
                    <div className="communities__divider" />
                  )}
                </div>
              ))}
          </section>
          <footer>
            {!isLoading && !error && (
              <Pagination
                currentPage={page}
                onClickAction={changePageNumber}
                totalPages={
                  data?.totalCommunities
                    ? Math.ceil(data?.totalCommunities / LIMIT)
                    : 1
                }
              />
            )}
          </footer>
        </main>
        <FormProvider {...methods}>
          <DialogFilters
            open={showFilters}
            onClose={() => setShowFilters(false)}
          />
          {!isMobile && <Filters outsideModal marginTop="7px" />}
        </FormProvider>
      </div>
    </div>
  )
}

export default MyCommunities
