import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { GraduationCap, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

// Schemas
import { academicEducationFields } from "../AcademicEducationSection/formFields"

// Services
import {
  deleteAcademicEducation,
  editAcademicEducation,
} from "../../../../services/authServices"

// Custom hooks
import { useMedia } from "../../../../hooks/useMedia"

// Utils
import { formatPeriod } from "../../../../utils"

// Components
import ModalForm from "../ModalForm"
import ConfirmationModal from "../../../../components/ConfirmationModal"
import Dropdown from "../../../../components/Dropdown"

// Styles
import "./index.scss"

function AcademicEducationItem({ userId, academicEducation, canEdit, isLast }) {
  const [showModal, setShowModal] = useState("")
  const queryClient = useQueryClient()
  const isMobile = useMedia("(max-width: 720px)")

  const {
    name,
    institution,
    degree,
    startDateMonth,
    startDateYear,
    endDateMonth,
    endDateYear,
  } = academicEducation
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
      await editAcademicEducation({
        ...values,
        academicEducationId: academicEducation._id,
      })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Formação editada")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao editar formação")
    },
  })

  const handleRemoveExperience = useMutation({
    mutationFn: async (academicFormationId) => {
      await deleteAcademicEducation(academicFormationId)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Formação removida")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao remover formação")
    },
  })

  const defaultValues = {
    name,
    institution,
    degree,
    startDateMonth,
    startDateYear,
    endDateMonth,
    endDateYear,
  }

  return (
    <div
      className="academic-education-item"
      style={
        !isLast ? { paddingBottom: 10, borderBottom: "1px solid #d9d9d9" } : {}
      }
    >
      <header>
        <div>
          <GraduationCap />
        </div>
        <div className="academic-education-item__info-container">
          <h3 className="academic-education-item__course">{name}</h3>
          {canEdit && !isMobile && (
            <>
              <button
                className="profile__action-button-section"
                aria-label="Editar formação"
                style={{ position: "absolute", marginRight: 0, marginTop: 0 }}
                onClick={() => setShowModal("edit")}
              >
                <Pencil />
              </button>
              <button
                className="profile__action-button-section"
                aria-label="Remover formação"
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
                buttonLabel="Abrir opções da formação"
              >
                <MoreVertical />
              </Dropdown>
            </div>
          )}
          <p className="academic-education-item__institution">{institution}</p>
          <p className="academic-education-item__period">
            {formatPeriod({
              startDateMonth,
              startDateYear,
              endDateMonth,
              endDateYear,
            })}
          </p>
          <p className="academic-education-item__type">{degree}</p>
        </div>
      </header>
      <ModalForm
        title="Editar formação"
        formFields={academicEducationFields}
        open={showModal === "edit"}
        isLoading={submitForm.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal(false)}
        onConfirm={submitForm.mutate}
      />
      <ConfirmationModal
        open={showModal == "remove"}
        type="delete"
        options={{
          title: "Excluir formação",
          descriptionText: "Tem certeza que deseja excluir esta formação?",
          confirmText: "Excluir",
        }}
        actionIsLoading={handleRemoveExperience.isLoading}
        onCloseModal={() => setShowModal("")}
        onConfirm={() => handleRemoveExperience.mutate(academicEducation._id)}
      />
    </div>
  )
}

export default AcademicEducationItem
