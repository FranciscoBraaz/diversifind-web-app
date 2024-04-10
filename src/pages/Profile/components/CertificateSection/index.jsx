import { useState } from "react"
import SectionHeader from "../SectionHeader"
import ModalForm from "../ModalForm"
import CertificateItem from "../CertificateItem"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Schemas
import { certificateFields } from "./formFields"
import { createCertificate } from "../../../../services/authServices"

// Styles
import "./index.scss"
import { parseLocalStorageJson } from "../../../../utils"
import Button from "../../../../components/Button"

function CertificateSection({ userId, certificates = [] }) {
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()
  const userLogged = parseLocalStorageJson("diversiFindUser")
  const canEditProfile = userLogged._id === userId

  const submitForm = useMutation({
    mutationFn: async (values) => {
      await createCertificate(values)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Certificado adicionado")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao adicionar certificado")
    },
  })

  const defaultValues = {
    name: "",
    institution: "",
    issueMonth: "",
    issueYear: "",
    url: "",
  }

  return (
    <section className="certificate-section">
      <SectionHeader
        title="Certificados"
        canEdit={canEditProfile}
        buttonAction={() => setShowModal(true)}
      />
      <section>
        {certificates.length === 0 && canEditProfile && (
          <Button
            styleType="outlined"
            style={{ width: "fit-content" }}
            onClick={() => setShowModal(true)}
          >
            Adicione um certificado
          </Button>
        )}
        {certificates.length === 0 && !canEditProfile && (
          <p>Nenhum certificado adicionado pelo usuário</p>
        )}
        {certificates.map((certificate, index) => (
          <CertificateItem
            key={index}
            userId={userId}
            certificate={certificate}
            canEdit={canEditProfile}
            isLast={index === certificates.length - 1}
          />
        ))}
      </section>
      <ModalForm
        title="Certificados"
        formFields={certificateFields}
        open={showModal}
        isLoading={submitForm.isPending}
        defaultValues={defaultValues}
        onClose={() => setShowModal(false)}
        onConfirm={submitForm.mutate}
      />
    </section>
  )
}

export default CertificateSection
