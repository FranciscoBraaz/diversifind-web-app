import { useEffect, useState } from "react"
import {
  Accessibility,
  ArrowLeftCircle,
  Building,
  CheckCircle2,
  FileClock,
  FileText,
  Globe,
  MapPin,
  PencilLine,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import Skeleton from "react-loading-skeleton"
import _ from "lodash"

// Schemas
import { candidatureFields } from "./formFields"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Services
import { getVacancy, submitCandidature } from "../../services/vacancyService"

// Components
import Menu from "../../components/Menu"
import Chip from "../../components/Chip"
import Button from "../../components/Button"
import Tabs from "../../components/Tabs"
import VacancyDetails from "./components/VacancyDetails"
import ModalForm from "./components/ModalForm"
import VacancyCandidates from "./components/VacancyCandidates"

// Styles
import "./index.scss"

const contractTypeMap = {
  clt: "CLT",
  pj: "PJ",
  internship: "Contrato de estágio",
  other: "Outro",
}

const mapEmploymentTypeText = {
  fullTime: "Tempo integral",
  partTime: "Meio período",
  autonomous: "Autônomo",
  internship: "Estágio",
  freelancer: "Freelancer",
  trainee: "Trainee",
  temporary: "Temporário",
  apprentice: "Aprendiz",
  volunteer: "Voluntário",
  outsourced: "Terceirizado",
}

function SkeletonBody() {
  return (
    <main className="vacancy__main">
      <div className="vacancy__skeleton-body">
        <section className="vacancy__skeleton-body__initial-info">
          <div className="vacancy__skeleton-body__initial-info__header">
            <div>
              <Skeleton width="60%" height={40} />
              <Skeleton width={160} height={30} />
            </div>
            <div>
              <Skeleton width={200} height={25} />
            </div>
          </div>
          <div>
            <Skeleton width="50%" height={25} />
          </div>
          <div className="vacancy__skeleton-body__initial-info__footer">
            <div>
              <Skeleton width={200} height={25} />
            </div>
            <div>
              <Skeleton width={140} height={40} />
            </div>
          </div>
        </section>
        <section>
          <Skeleton width={200} height={30} />
          <Skeleton width="100%" height={200} style={{ marginTop: 16 }} />
        </section>
        <section className="vacancy__skeleton-body__accessibility">
          <Skeleton width={200} height={20} />
          <div>
            <Skeleton width="70%" height={30} />
            <div>
              <Skeleton width={200} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={200} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={200} height={20} style={{ marginTop: 8 }} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Skeleton width="70%" height={30} />
            <div>
              <Skeleton width={200} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={200} height={20} style={{ marginTop: 8 }} />
              <Skeleton width={200} height={20} style={{ marginTop: 8 }} />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Vacancy() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = parseLocalStorageJson("diversiFindUser")

  const [currentTab, setCurrentTab] = useState("vacancyDetails")
  const [showModal, setShowModal] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)

  const tabs = [
    {
      icon: "Trello",
      tabName: "Detalhes da vaga",
      id: "vacancyDetails",
    },
    {
      icon: "Trello",
      tabName: "Candidatos",
      id: "candidates",
    },
  ]

  const { isLoading, data, error } = useQuery({
    queryKey: ["vacancy", id],
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
      const data = await getVacancy(id)
      return data
    } catch (error) {
      console.error("Error fetching vacancy: ", error)
      return {}
    }
  }

  async function submitForm(values) {
    try {
      setIsSubmiting(true)
      await submitCandidature({ vacancyId: id, contactEmail: values.email })
      await queryClient.invalidateQueries(["vacancy", id])
      toast.success("Candidatura enviada")
      setShowModal(false)
    } catch (error) {
      console.error("Error submitting candidature: ", error)
      toast.error("Erro ao enviar candidatura")
    } finally {
      setIsSubmiting(false)
    }
  }

  function checkIfUserHasAlreadyApplied() {
    if (!data?.applications) return false

    return data.applications.some(
      (candidature) => candidature.candidate === user._id,
    )
  }

  function goBack() {
    navigate(-1)
  }

  function returnLocation(data) {
    if (data?.externalVacancy) {
      return data?.externalVacancyLocation ?? "-"
    }

    if (data?.typeLocation === "remote") {
      return "Remoto"
    }

    return `Presencial, ${data?.city} - ${data?.stateUf}`
  }

  function returnContent() {
    if (currentTab === "candidates") {
      return <VacancyCandidates id={id} />
    }

    return <VacancyDetails data={data} />
  }

  const userHasAlreadyApplied = checkIfUserHasAlreadyApplied()

  return (
    <div className="vacancy">
      <div className="vacancy-container">
        <Menu />
        {isLoading && <SkeletonBody />}
        {!isLoading && error && <div>Erro ao carregar a vaga</div>}
        {!isLoading && !_.isEmpty(data) && (
          <main className="vacancy__main">
            <section className="vacancy__initial-info">
              <header>
                <div className="vacancy__occupation-info">
                  <div className="vacancy__occupation-info__container-title">
                    <button onClick={goBack}>
                      <ArrowLeftCircle size={24} />
                    </button>
                    <h2>{data.occupation}</h2>
                  </div>
                  <div>
                    <Building />
                    <h3>{data.company}</h3>
                  </div>
                </div>
                {data.author?._id === user._id && (
                  <Tabs
                    tabs={tabs}
                    currentTab={tabs.find((tab) => tab.id === currentTab)}
                    onChangeTab={(tab) => setCurrentTab(tab.id)}
                  />
                )}
              </header>
              <div className="vacancy__location-contract-type">
                <div>
                  {data.typeLocation === "remote" ? (
                    <Globe size={16} color="#16b1ff" />
                  ) : (
                    <MapPin size={16} color="#16b1ff" />
                  )}

                  <span>{returnLocation(data)}</span>
                </div>
                <div>
                  <FileText size={16} color="#E93D82" />
                  <span>
                    {data.contractType
                      ? contractTypeMap[data.contractType]
                      : "Tipo de contrato não informado"}
                  </span>
                </div>
                <div>
                  <FileClock size={16} color="#ffb400" />
                  <span>
                    {data.employmentType
                      ? mapEmploymentTypeText[data.employmentType]
                      : "Tipo de emprego não informado"}
                  </span>
                </div>
              </div>
              <footer className="vacancy__footer">
                <div className="vacancy__skills">
                  {data.skills.map((skill) => (
                    <Chip key={skill._id}>{skill.name}</Chip>
                  ))}
                </div>
                {data.author?._id === user._id && (
                  <Button
                    leftIcon={<PencilLine size={16} />}
                    styleType="contained"
                    onClick={() => navigate(`/vagas/editar-vaga/${id}`)}
                    style={{ width: "fit-content" }}
                  >
                    Editar
                  </Button>
                )}
                {!userHasAlreadyApplied && data.author?._id !== user._id && (
                  <Button
                    leftIcon={<Accessibility size={16} />}
                    styleType="contained"
                    style={{ width: "fit-content" }}
                    onClick={() => setShowModal(true)}
                  >
                    Candidate-se
                  </Button>
                )}
                {userHasAlreadyApplied && (
                  <Button
                    leftIcon={<CheckCircle2 size={16} />}
                    styleType="contained"
                    disabled
                    style={{ width: "fit-content" }}
                    onClick={() => setShowModal(true)}
                  >
                    Candidatou-se
                  </Button>
                )}
              </footer>
            </section>
            {returnContent()}
          </main>
        )}
      </div>
      <ModalForm
        title="Candidatura"
        formFields={candidatureFields}
        open={showModal}
        isLoading={isSubmiting}
        onClose={() => setShowModal(false)}
        onConfirm={submitForm}
        maxHeight="60vh"
      />
    </div>
  )
}

export default Vacancy
