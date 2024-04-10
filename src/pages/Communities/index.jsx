import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { PlusCircle, SlidersHorizontal } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Services
import { getCommunities } from "../../services/communityService"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

// Components
import Button from "../../components/Button"
import CommunityCard from "./components/CommunityCard"
import CommunityModal from "../../components/CommunityModal"
import DialogFilters from "./components/DialogFilters"
import Filters from "./components/Filters"
import Pagination from "../../components/Pagination"
import Menu from "../../components/Menu"
import Search from "../Jobs/components/Search"

// Styles
import "./index.scss"

const LIMIT = 20

function SkeletonCommunityCard({ isLast }) {
  function returnClassName() {
    let className = "skeleton-community-card"
    if (isLast) className += " skeleton-community-card--last"

    return className
  }

  return (
    <div className={returnClassName()}>
      <header>
        <div className="skeleton-community-card__inner-header-container">
          <Skeleton count={1} style={{ width: "60%", height: 30 }} />
          <div>
            <div>
              <Skeleton count={1} style={{ width: 100, height: 20 }} />
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
          <Skeleton count={1} style={{ width: 140, height: 35 }} />
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

function Communities() {
  const [filters, setFilters] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const isMobile = useMedia("(max-width: 960px)")
  const user = parseLocalStorageJson("diversiFindUser")
  const { page = 1, keyword = "" } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const methods = useForm({
    defaultValues: {
      sortType: "recent",
      professionalArea: "",
      platforms: {
        whatsapp: false,
        telegram: false,
        discord: false,
        facebook: false,
        reddit: false,
        linkedin: false,
      },
    },
  })
  const { watch } = methods

  const { isLoading, data, error } = useQuery({
    queryKey: ["communities", page, filters, keyword],
    queryFn: () => fetchCommunities(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  const changePageNumber = useCallback(
    (pageNumber) => {
      if (keyword) {
        navigate(`/comunidades/todas-comunidades/${pageNumber}/${keyword}`)
        return
      }

      navigate(`/comunidades/todas-comunidades/${pageNumber}`)

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

      const data = await getCommunities({
        page,
        limit: LIMIT,
        filters: newFilters,
        keyword,
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
      navigate(`/comunidades/todas-comunidades/${1}/${value}`)
    },
    [navigate, keyword],
  )

  return (
    <div className="communities">
      <div className="communities-container">
        <Menu />
        <main className="communities__main" ref={containerRef}>
          <div className="communities__container-search-filters">
            <Search
              initialValue={keyword}
              placeholder="Pesquise por comunidades"
              onChange={handleChangeKeyword}
            />
            {isMobile && (
              <div className="communities__mobile-buttons">
                <Button
                  styleType="contained"
                  style={{
                    // backgroundColor: "#26a69a",
                    gap: "8px",
                    width: "fit-content",
                  }}
                  rightIcon={<PlusCircle size={18} />}
                  onClick={() => setShowModal(true)}
                >
                  Cadastrar comunidade
                </Button>
                <Button
                  styleType="outlined"
                  rightIcon={<SlidersHorizontal />}
                  style={{ width: "fit-content", gap: "8px" }}
                  onClick={() => setShowFilters(true)}
                >
                  Filtros
                </Button>
              </div>
            )}
          </div>

          <section className="communities__card-container">
            {isLoading && <SkeletonBody />}
            {!isLoading && error && <p>Erro ao carregar vagas</p>}
            {!isLoading && (
              <>
                <header>
                  <h1>Resultados ({data?.totalCommunities ?? 0})</h1>
                </header>
                <section className="communities__cards">
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
              </>
            )}
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
          {!isMobile && (
            <Filters
              onClickAction={() => setShowModal(true)}
              outsideModal
              hasCommunityButton
            />
          )}
        </FormProvider>
      </div>
      <CommunityModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}

export default Communities
