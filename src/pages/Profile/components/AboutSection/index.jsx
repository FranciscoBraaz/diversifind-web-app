import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Schemas
import { aboutFields } from "./formFields"

// Utils
import { parseLocalStorageJson } from "../../../../utils"

// Services
import { updateAbout } from "../../../../services/authServices"

// Compoennts
import SectionHeader from "../SectionHeader"
import ModalForm from "../ModalForm"
import Button from "../../../../components/Button"

// Styles
import "./index.scss"

function AboutSection({ userId, about }) {
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()
  const userLogged = parseLocalStorageJson("diversiFindUser")
  const canEditProfile = userLogged._id === userId

  const submitForm = useMutation({
    mutationFn: async (values) => {
      await updateAbout(values.about)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      toast.success("As alterações foram salvas")
      setShowModal()
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao salvar as alterações")
    },
  })

  const defaultValues = { about }
  return (
    <section className="about-section">
      <SectionHeader
        title="Sobre"
        icon="Pencil"
        canEdit={canEditProfile}
        buttonAction={() => setShowModal(true)}
      />
      {about && <p>{about}</p>}
      {!about && canEditProfile && (
        <Button
          styleType="outlined"
          style={{ width: "fit-content", marginTop: "8px" }}
          onClick={() => setShowModal(true)}
        >
          Fale um pouco sobre você
        </Button>
      )}
      <ModalForm
        title="Sobre"
        maxHeight="60vh"
        formFields={aboutFields}
        open={showModal}
        isLoading={submitForm.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal(false)}
        onConfirm={submitForm.mutate}
      />
    </section>
  )
}

export default AboutSection
