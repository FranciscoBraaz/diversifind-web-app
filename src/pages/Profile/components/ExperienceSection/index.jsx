import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Schemas
import { experienceFields } from "./formFields"

// Services
import { createExperience } from "../../../../services/authServices"

// Utils
import { parseLocalStorageJson } from "../../../../utils"

// Components
import ExperienceItem from "../ExperienceItem"
import ModalForm from "../ModalForm"
import SectionHeader from "../SectionHeader"
import Button from "../../../../components/Button"

// Styles
import "./index.scss"

function ExperienceSection({ userId, experiences = [] }) {
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()
  const userLogged = parseLocalStorageJson("diversiFindUser")
  const canEditProfile = userLogged._id === userId

  const submitForm = useMutation({
    mutationFn: async (values) => {
      await createExperience(values)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal(false)
      toast.success("Experiência adicionada")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao adicionar experiência")
    },
  })

  const defaultValues = {
    occupation: "",
    company: "",
    startDateMonth: "",
    startDateYear: "",
    endDateMonth: "",
    endDateYear: "",
    current: false,
    type: "",
    description: "",
  }

  return (
    <section className="experience-section">
      <SectionHeader
        title="Experiência"
        canEdit={canEditProfile}
        buttonAction={() => setShowModal(true)}
      />

      <section>
        {experiences.length === 0 && canEditProfile && (
          <Button
            styleType="outlined"
            style={{ width: "fit-content" }}
            onClick={() => setShowModal(true)}
          >
            Adicione uma experiência
          </Button>
        )}
        {experiences.length === 0 && !canEditProfile && (
          <p>Nenhuma experiência adicionada pelo usuário</p>
        )}
        {experiences.map((experience, index) => (
          <ExperienceItem
            key={index}
            userId={userId}
            experience={experience}
            canEdit={canEditProfile}
            isLast={index === experiences.length - 1}
          />
        ))}
      </section>
      <ModalForm
        title="Experiência"
        formFields={experienceFields}
        open={showModal}
        isLoading={submitForm.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal(false)}
        onConfirm={submitForm.mutate}
      />
    </section>
  )
}

export default ExperienceSection
