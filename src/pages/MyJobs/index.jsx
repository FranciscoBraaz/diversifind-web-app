import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { SlidersHorizontal } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Services
import { getVacanciesByAuthor } from "../../services/vacancyService"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

// Components
import { useQuery } from "@tanstack/react-query"
import Menu from "../../components/Menu"
import JobCard from "../Jobs/components/JobCard"
import Search from "../Jobs/components/Search"
import Pagination from "../../components/Pagination"
import DialogFilters from "../Jobs/components/DialogFilters"
import Filters from "../Jobs/components/Filters"
import Button from "../../components/Button"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

const LIMIT = 25

function SkeletonJobCard({ isLast }) {
  function returnClassName() {
    let className = "skeleton-job-card"
    if (isLast) className += " skeleton-job-card--last"

    return className
  }

  return (
    <div className={returnClassName()}>
      <header>
        <div className="skeleton-job-card__inner-header-container">
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
    <div className="jobs__skeleton-body">
      <header>
        <div>
          <Skeleton count={1} style={{ width: 100, height: 35 }} />
        </div>
        <div>
          <Skeleton count={1} style={{ width: 120, height: 35 }} />
        </div>
      </header>
      <section>
        <SkeletonJobCard />
        <SkeletonJobCard />
        <SkeletonJobCard isLast />
      </section>
    </div>
  )
}

function MyJobs() {
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useMedia("(max-width: 960px)")

  const { page = 1, keyword = "" } = useParams()
  const navigate = useNavigate()
  const methods = useForm({
    defaultValues: {
      typeLocation: {
        onsite: false,
        remote: false,
        hybrid: false,
      },
      contractType: {
        clt: false,
        pj: false,
        internship: false,
        other: false,
      },
      employmentType: "",
      occupationArea: "",
    },
  })

  const { isLoading, data, error } = useQuery({
    queryKey: ["my-vacancies", page, filters, keyword],
    queryFn: () => fetchVacancies(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  const containerRef = useRef(null)
  const { watch } = methods

  const changePageNumber = useCallback(
    (pageNumber) => {
      if (keyword) {
        navigate(`/vagas/minhas-vagas/${pageNumber}/${keyword}`)
        return
      }

      navigate(`/vagas/minhas-vagas/${pageNumber}`)

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

  async function fetchVacancies() {
    try {
      let newFilters = { ...filters }
      if (!_.isEmpty(newFilters)) {
        const typeLocationKeys = Object.keys(newFilters["typeLocation"])
        const contractTypeKeys = Object.keys(newFilters["contractType"])
        newFilters["typeLocation"] = typeLocationKeys.filter(
          (key) => newFilters["typeLocation"][key],
        )
        newFilters["contractType"] = contractTypeKeys.filter(
          (key) => newFilters["contractType"][key],
        )
      }

      const data = await getVacanciesByAuthor({
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
      navigate(`/vagas/minhas-vagas/${1}/${value}`)
    },
    [navigate, keyword],
  )

  return (
    <div className="my-jobs">
      <div className="my-jobs-container">
        <Menu />
        <section className="my-jobs__main" ref={containerRef}>
          <header className="my-jobs__header">
            <h2>Gerencie as vagas que você cadastrou na plataforma</h2>
            <div className="jobs__container-search-filters">
              <Search initialValue={keyword} onChange={handleChangeKeyword} />
              {isMobile && (
                <div className="jobs__mobile-buttons">
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
          </header>
          <section className="my-jobs__cards">
            {isLoading && <SkeletonBody />}
            {_.isEmpty(data?.vacancies) && !error && (
              <p>Nenhuma vaga encontrada</p>
            )}
            {!_.isEmpty(data?.vacancies) &&
              data.vacancies.map((job, index) => (
                <div key={job._id}>
                  <JobCard job={job} hasActions />
                  {index < data.vacancies.length - 1 && (
                    <div className="jobs__divider" />
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
                  data?.totalVacancies
                    ? Math.ceil(data?.totalVacancies / LIMIT)
                    : 1
                }
              />
            )}
          </footer>
        </section>
        <FormProvider {...methods}>
          <DialogFilters
            open={showFilters}
            onClose={() => setShowFilters(false)}
          />
          {!isMobile && <Filters outsideModal />}
        </FormProvider>
      </div>
    </div>
  )
}

export default MyJobs
