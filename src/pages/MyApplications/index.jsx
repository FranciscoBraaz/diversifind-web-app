import { useNavigate, useParams } from "react-router-dom"
import { useCallback, useRef } from "react"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Services
import { getMyApplications } from "../../services/vacancyService"

// Components
import { useQuery } from "@tanstack/react-query"
import Menu from "../../components/Menu"
import JobCard from "../Jobs/components/JobCard"
import Search from "../Jobs/components/Search"
import Pagination from "../../components/Pagination"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

const LIMIT = 3

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

function MyApplications() {
  const { page = 1, keyword = "" } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const { isLoading, data, error } = useQuery({
    queryKey: ["my-applications", page, keyword],
    queryFn: () => fetchApplications(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  const changePageNumber = useCallback(
    (pageNumber) => {
      if (keyword) {
        navigate(`/vagas/minhas-aplicacoes/${pageNumber}/${keyword}`)
        return
      }

      navigate(`/vagas/minhas-aplicacoes/${pageNumber}`)

      if (containerRef?.current) {
        containerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    },
    [keyword, navigate],
  )

  async function fetchApplications() {
    try {
      const data = await getMyApplications({ page, keyword })
      return data
    } catch (error) {
      console.error("Error fetching applications: ", error)
      return []
    }
  }

  const handleChangeKeyword = useCallback(
    (value) => {
      if (keyword === value) return
      navigate(`/vagas/minhas-aplicacoes/${1}/${value}`)
    },
    [navigate, keyword],
  )

  return (
    <div className="my-applications">
      <div className="my-applications-container">
        <Menu />
        <main className="my-applications__main" ref={containerRef}>
          <header className="my-applications__header">
            <h2>Visualize suas candidaturas</h2>
            <Search initialValue={keyword} onChange={handleChangeKeyword} />
          </header>
          <section className="my-applications__cards">
            {isLoading && <SkeletonBody />}
            {_.isEmpty(data?.applications) && !error && (
              <p>Nenhuma vaga encontrada</p>
            )}
            {!_.isEmpty(data?.applications) &&
              data.applications.map((application, index) => (
                <div key={application._id}>
                  <JobCard job={application.vacancy} />
                  {index < data.applications.length - 1 && (
                    <div className="jobs__divider" />
                  )}
                </div>
              ))}
          </section>
          <footer>
            {!isLoading && !error && !_.isEmpty(data?.applications) && (
              <Pagination
                currentPage={page}
                onClickAction={changePageNumber}
                totalPages={
                  data?.totalApplications
                    ? Math.ceil(data?.totalApplications / LIMIT)
                    : 1
                }
              />
            )}
          </footer>
        </main>
      </div>
    </div>
  )
}

export default MyApplications
