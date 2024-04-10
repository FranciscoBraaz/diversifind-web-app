import { useCallback, useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, ArrowUpRightSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Services
import { getVacancyCandidates } from "../../../../services/vacancyService"

// Components
import Avatar from "../../../../components/Avatar"
import Button from "../../../../components/Button"
import Pagination from "../../../../components/Pagination"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function SkeletonCandidate({ isLast }) {
  return (
    <div
      className={`skeleton-candidate ${
        isLast ? "skeleton-candidate--isLast" : ""
      }`}
    >
      <div className="skeleton-candidate__header">
        <div className="skeleton-candidate__user-info">
          <div>
            <Skeleton circle={true} count={1} height={60} width={60} />
          </div>
          <div style={{ width: "100%" }}>
            <Skeleton count={1} width="60%" height={30} />
            <Skeleton count={1} width="70%" height={25} />
            <Skeleton count={1} width="20%" height={25} />
          </div>
        </div>
        <div>
          <Skeleton count={1} width={80} height={30} />
        </div>
      </div>
      <Skeleton count={1} width="100%" height={200} />
      <div className="skeleton-candidate__view-profile">
        <Skeleton count={1} width={120} height={30} />
      </div>
    </div>
  )
}

function SkeletonsCandidates() {
  return (
    <div className="sekeletons-candidates">
      <SkeletonCandidate />
      <SkeletonCandidate />
      <SkeletonCandidate />
      <SkeletonCandidate />
      <SkeletonCandidate isLast />
    </div>
  )
}

const LIMIT = 25

function VacancyCandidates({ id }) {
  const containerRef = useRef(null)
  const [page, setPage] = useState(1)

  const navigate = useNavigate()
  const { isLoading, data, error } = useQuery({
    queryKey: ["vacancy-candidates", id, page],
    queryFn: () => fetchVacancyInfo(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  async function fetchVacancyInfo() {
    try {
      const data = await getVacancyCandidates(id, page)
      return data
    } catch (error) {
      console.error("Error fetching vacancy: ", error)
      return {}
    }
  }

  function handleOpenResume(resumeUrl) {
    window.open(resumeUrl, "_blank")
  }

  const changePageNumber = useCallback((pageNumber) => {
    setPage(pageNumber)

    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [])

  function returnVacancyCandidateClassName(isLast) {
    let className = "vacancy-candidates__candidate"

    if (!isLast) className += " vacancy-candidates__candidate--last"

    return className
  }

  return (
    <section className="vacancy-candidates">
      <div className="vacancy-candidates__inner-container">
        {isLoading && <SkeletonsCandidates />}
        {error && <p>Ocorreu um erro ao carregar os candidatos</p>}
        {!isLoading && !error && _.isEmpty(data?.applications) && (
          <p>Nenhum candidato até o momento</p>
        )}
        {!_.isEmpty(data?.applications) &&
          data.applications.map((item, index) => (
            <div
              key={item.candidate._id}
              className={returnVacancyCandidateClassName(
                index === data.length - 1,
              )}
              ref={containerRef}
            >
              <header>
                <div className="vacancy-candidates__candidate__basic-info">
                  <Avatar
                    src={item.candidate.avatar}
                    alt={item.candidate.name}
                    style={{ width: 70, height: 70 }}
                  />
                  <div>
                    <h6>{item.candidate.name}</h6>
                    <p>{item.candidate.headline}</p>
                    <p>
                      {item.candidate.city
                        ? `${item.candidate.city} - ${item.candidate.stateUf}`
                        : "-"}
                    </p>
                  </div>
                </div>
                <Button
                  styleType="contained"
                  style={{
                    width: "fit-content",
                    height: "30px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => navigate(`/perfil/${item.candidate._id}`)}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Ver Perfil
                </Button>
              </header>
              <p className="vacancy-candidates__candidate-email">
                <strong>Email para contato:</strong> {item.contactEmail}
              </p>
              <p className="vacancy-candidates__candidate-about">
                {item.candidate.about}
              </p>
              <footer>
                <Button
                  styleType="outlined"
                  style={{ width: "fit-content" }}
                  rightIcon={<ArrowUpRightSquare />}
                  onClick={() => handleOpenResume(item.candidate.resumeUrl)}
                >
                  Visualizar currículo
                </Button>
              </footer>
            </div>
          ))}
      </div>

      {!isLoading && !error && (
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
    </section>
  )
}

export default VacancyCandidates
