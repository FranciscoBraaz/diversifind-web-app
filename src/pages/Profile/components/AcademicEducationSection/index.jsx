import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Schemas
import { academicEducationFields } from "./formFields"

// Services
import { createAcademicEducation } from "../../../../services/authServices"

// Utils
import { parseLocalStorageJson } from "../../../../utils"

// Components
import AcademicEducationItem from "../AcademicEducationItem"
import ModalForm from "../ModalForm"
import SectionHeader from "../SectionHeader"
import Button from "../../../../components/Button"

// Styles
import "./index.scss"

function AcademicEducationSection({ userId, academicEducations = [] }) {
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()
  const userLogged = parseLocalStorageJson("diversiFindUser")
  const canEditProfile = userLogged._id === userId

  const submitForm = useMutation({
    mutationFn: async (values) => {
      await createAcademicEducation(values)
    },
    onSuccess: async () => {
      const data = await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Formação adicionada")
      return data
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao adicionar formação")
    },
  })

  const defaultValues = {
    name: "",
    institution: "",
    degree: "",
    startDateMonth: "",
    startDateYear: "",
    endDateMonth: "",
    endDateYear: "",
  }

  return (
    <section className="academic-education-section">
      <SectionHeader
        title="Formação"
        canEdit={canEditProfile}
        buttonAction={() => setShowModal(true)}
      />
      <section>
        {academicEducations.length === 0 && canEditProfile && (
          <Button
            styleType="outlined"
            style={{ width: "fit-content" }}
            onClick={() => setShowModal(true)}
          >
            Adicione uma formação
          </Button>
        )}
        {academicEducations.length === 0 && !canEditProfile && (
          <p>Nenhuma formação adicionada pelo usuário</p>
        )}
        {academicEducations.map((academicEducation, index) => (
          <AcademicEducationItem
            key={index}
            userId={userId}
            academicEducation={academicEducation}
            canEdit={canEditProfile}
            isLast={index === academicEducations.length - 1}
          />
        ))}
      </section>
      <ModalForm
        title="Formação"
        formFields={academicEducationFields}
        open={showModal}
        isLoading={submitForm.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal(false)}
        onConfirm={submitForm.mutate}
      />
    </section>
  )
}

export default AcademicEducationSection
