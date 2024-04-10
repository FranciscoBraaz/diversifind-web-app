import { useState } from "react"
import { ArrowRight, Building, Globe, MapPin, MoreVertical } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import DOMPurify from "dompurify"

// Utils
import { getPassedtime } from "../../../../utils"

// Services
import { deleteVacancy } from "../../../../services/vacancyService"

// Components
import Chip from "../../../../components/Chip"
import Button from "../../../../components/Button"
import ConfirmationModal from "../../../../components/ConfirmationModal"
import Dropdown from "../../../../components/Dropdown"

// Styles
import "./index.scss"

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

const mapEmploymentTypeColor = {
  fullTime: "#fac74c",
  partTime: "#0090FF",
  autonomous: "#12A594",
  internship: "#E93D82",
  freelancer: "#EC9455",
  apprentice: "#86EAD4",
  volunteer: "#7CE2FE",
  trainee: "#6E56CF",
  outsourced: "#65BA74",
  temporary: "#F5A623",
}

const mapEmploymentTypeTextColor = {
  fullTime: "#505050",
  partTime: "#1E1E1E",
  autonomous: "#1E1E1E",
  internship: "#000",
  freelancer: "#373737",
  apprentice: "#505050",
  volunteer: "#000",
  trainee: "#fff",
  outsourced: "#373737",
  temporary: "#373737",
}

function JobCard({ job, hasActions = false }) {
  const jobInfo = job || {
    occupation: "",
    employmentType: "",
    createdAt: "",
    company: "",
    typeLocation: "",
    stateUf: "",
    city: "",
    description: "",
    skills: [],
    externalVacancy: false,
    externalVacancyLink: "",
    externalVacancyLocation: "",
  }

  const {
    occupation,
    employmentType,
    createdAt,
    company,
    typeLocation,
    stateUf,
    city,
    description,
    skills,
    externalVacancy,
    externalVacancyLink,
    externalVacancyLocation,
  } = jobInfo
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showExternalVacancyModal, setShowExternalVacancyModal] =
    useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const dropdownOptions = [
    {
      label: "Apagar",
      icon: "Trash2",
      action: () => setShowDeleteModal(true),
    },
    {
      label: "Editar",
      icon: "Pencil",
      action: () => navigate(`/vagas/editar-vaga/${job._id}`),
    },
  ]

  const handleDeleteJob = useMutation({
    mutationFn: async (job) => {
      await deleteVacancy(job.jobId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["vacancies"])
      await queryClient.invalidateQueries(["my-vacancies"])
      setShowDeleteModal(false)
      toast.success("Vaga excluída")
    },
    onError: () => {
      // console.log(error)
      toast.error("Erro ao excluir vaga")
    },
  })

  function navigateToVacancy() {
    if (externalVacancy) {
      setShowExternalVacancyModal(true)
      return
    }

    navigate(`/vagas/vaga/${job._id}`)
  }

  function navigateToExternalVacancy() {
    window.open(externalVacancyLink, "_blank")
    setShowExternalVacancyModal(false)
  }

  function returnLocation() {
    if (externalVacancy) {
      return externalVacancyLocation ?? "-"
    }

    if (typeLocation === "remote") {
      return "Remoto"
    }

    return `Presencial, ${city} - ${stateUf}`
  }

  const sanitizedDescription = DOMPurify.sanitize(description)

  return (
    <div className="job-card">
      <header>
        <div className="job-card__basic-info">
          <h2 title={`Conteúdo: ${occupation}`}>{occupation}</h2>
          <div className="job-card__basic-info__left">
            {externalVacancy ? (
              <Chip
                backgroundColor="#3345A4"
                borderColor="#3345A4"
                color="#fff"
                style={{
                  fontWeight: "500",
                  minWidth: "fit-content",
                }}
              >
                Vaga externa
              </Chip>
            ) : (
              <Chip
                backgroundColor={mapEmploymentTypeColor[employmentType]}
                borderColor={mapEmploymentTypeColor[employmentType]}
                color={mapEmploymentTypeTextColor[employmentType]}
                style={{
                  fontWeight: "500",
                  minWidth: "fit-content",
                }}
              >
                {mapEmploymentTypeText[employmentType]}
              </Chip>
            )}
            <div className="job-card__basic-info__container-date">
              <p>{getPassedtime(createdAt)}</p>
              {hasActions && (
                <Dropdown
                  options={dropdownOptions}
                  width={120}
                  buttonLabel="Abrir opções da vaga"
                >
                  <MoreVertical size={22} />
                </Dropdown>
              )}
            </div>
          </div>
        </div>
        <div className="job-card__company-info">
          <div className="job-card__chip-mobile">
            {externalVacancy ? (
              <Chip
                backgroundColor="#3345A4"
                borderColor="#3345A4"
                color="#fff"
                style={{
                  fontWeight: "500",
                  minWidth: "fit-content",
                }}
              >
                Vaga externa
              </Chip>
            ) : (
              <Chip
                backgroundColor={mapEmploymentTypeColor[employmentType]}
                borderColor={mapEmploymentTypeColor[employmentType]}
                color={mapEmploymentTypeTextColor[employmentType]}
                style={{
                  fontWeight: "500",
                  minWidth: "fit-content",
                }}
              >
                {mapEmploymentTypeText[employmentType]}
              </Chip>
            )}
          </div>
          <p className="job-card__company">
            <Building size={16} />
            <span title={`Conteúdo: ${company}`}>{company}</span>
          </p>
          <p className="job-card__format">
            {!externalVacancy || typeLocation === "Remoto" ? (
              <Globe size={16} />
            ) : (
              <MapPin size={16} />
            )}
            <span title={`Conteúdo: ${company}`}>{returnLocation()}</span>
          </p>
        </div>
      </header>
      <p
        className="job-card__description"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
      <footer className="job-card__footer">
        <ul className="job-card__tags">
          {skills.map((skill) => (
            <li key={skill._id}>
              <Chip>{skill.name}</Chip>
            </li>
          ))}
        </ul>
        <Button
          style={{
            minWidth: "fit-content",
            width: "fit-content",
            height: 32,
          }}
          styleType="contained"
          rightIcon={<ArrowRight size={16} />}
          onClick={navigateToVacancy}
        >
          Acessar vaga
        </Button>
      </footer>
      <ConfirmationModal
        open={showDeleteModal}
        type="delete"
        options={{
          title: "Excluir vaga",
          descriptionText: "Tem certeza que deseja excluir esta vaga?",
          confirmText: "Excluir",
        }}
        actionIsLoading={handleDeleteJob.isPending}
        onCloseModal={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteJob.mutate({ jobId: job._id })}
      />
      <ConfirmationModal
        open={showExternalVacancyModal}
        options={{
          title: `Vaga externa - ${occupation}`,
          descriptionText:
            "Esta é uma vaga externa, deseja ser redirecionado para a página da vaga?",
          confirmText: "Sim, continuar",
        }}
        onCloseModal={() => setShowExternalVacancyModal(false)}
        onConfirm={() => navigateToExternalVacancy()}
      />
    </div>
  )
}

export default JobCard
