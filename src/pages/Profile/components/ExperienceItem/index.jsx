import { useState } from "react"
import { Building2, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Schemas
import { experienceFields } from "../ExperienceSection/formFields"

// Services
import {
  deleteExperience,
  editExperience,
} from "../../../../services/authServices"

// Custom hooks
import { useMedia } from "../../../../hooks/useMedia"

// Utils
import { formatPeriod } from "../../../../utils"

// Components
import ModalForm from "../ModalForm"
import Dropdown from "../../../../components/Dropdown"
import ConfirmationModal from "../../../../components/ConfirmationModal"

// Styles
import "./index.scss"

function ExperienceItem({ userId, experience, canEdit, isLast }) {
  const [showModal, setShowModal] = useState("")
  const queryClient = useQueryClient()
  const isMobile = useMedia("(max-width: 720px)")

  const {
    occupation,
    company,
    startDateMonth,
    startDateYear,
    endDateMonth,
    endDateYear,
    type,
    current,
    description,
  } = experience
  const dropdownOptions = [
    {
      label: "Apagar",
      icon: "Trash2",
      action: () => setShowModal("remove"),
    },
    {
      label: "Editar",
      icon: "Pencil",
      action: () => setShowModal("edit"),
    },
  ]

  const submitForm = useMutation({
    mutationFn: async (values) => {
      await editExperience({ ...values, experienceId: experience._id })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Experiência editada")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao editar experiência")
    },
  })

  const handleRemoveExperience = useMutation({
    mutationFn: async (experienceId) => {
      await deleteExperience(experienceId)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Experiência removida")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao remover experiência")
    },
  })

  const defaultValues = {
    occupation,
    company,
    startDateMonth,
    startDateYear,
    endDateMonth,
    endDateYear,
    current,
    type,
    description,
  }
  return (
    <div
      className="experience-item"
      style={
        !isLast ? { paddingBottom: 10, borderBottom: "1px solid #d9d9d9" } : {}
      }
    >
      <header>
        <div>
          <Building2 />
        </div>
        <div className="experience-item__info-container">
          <h3 className="experience-item__occupation">{occupation}</h3>
          {canEdit && !isMobile && (
            <>
              <button
                className="profile__action-button-section"
                aria-label="Editar experiência"
                style={{ position: "absolute", marginRight: 0, marginTop: 0 }}
                onClick={() => setShowModal("edit")}
              >
                <Pencil />
              </button>
              <button
                className="profile__action-button-section"
                aria-label="Remover experiência"
                style={{ position: "absolute", marginRight: 48, marginTop: 0 }}
                onClick={() => setShowModal("remove")}
              >
                <Trash2 />
              </button>
            </>
          )}

          {canEdit && isMobile && (
            <div className="profile__more-ptions">
              <Dropdown
                options={dropdownOptions}
                width={120}
                buttonLabel="Abrir opções da experiência"
              >
                <MoreVertical />
              </Dropdown>
            </div>
          )}
          <p className="experience-item__company">{company}</p>
          <p className="experience-item__period">
            {formatPeriod({
              startDateMonth,
              startDateYear,
              endDateMonth,
              endDateYear,
            })}
          </p>
          <div className="experience-item__location-type">
            <p>{type}</p>
          </div>
        </div>
      </header>
      <p className="experience-item__description">{description}</p>
      <ModalForm
        title="Experiência"
        formFields={experienceFields}
        open={showModal === "edit"}
        isLoading={submitForm.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal("")}
        onConfirm={submitForm.mutate}
      />
      <ConfirmationModal
        open={showModal == "remove"}
        type="delete"
        options={{
          title: "Excluir experiência",
          descriptionText: "Tem certeza que deseja excluir esta experiência?",
          confirmText: "Excluir",
        }}
        actionIsLoading={handleRemoveExperience.isLoading}
        onCloseModal={() => setShowModal("")}
        onConfirm={() => handleRemoveExperience.mutate(experience._id)}
      />
    </div>
  )
}

export default ExperienceItem
