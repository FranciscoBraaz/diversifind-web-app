import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowUpRightSquare,
  FileBadge,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "react-toastify"

// Schemas
import { certificateFields } from "../CertificateSection/formFields"

// Services
import {
  deleteCertificate,
  editCertificate,
} from "../../../../services/authServices"

// Custom hooks
import { useMedia } from "../../../../hooks/useMedia"

// Utils
import { formatCertificateDate } from "../../../../utils"

// Components
import ModalForm from "../ModalForm"
import ConfirmationModal from "../../../../components/ConfirmationModal"
import Button from "../../../../components/Button"
import Dropdown from "../../../../components/Dropdown"

// Styles
import "./index.scss"

function CertificateItem({ userId, certificate, canEdit, isLast }) {
  const [showModal, setShowModal] = useState("")
  const queryClient = useQueryClient()
  const isMobile = useMedia("(max-width: 720px)")

  const { name, institution, issueMonth, issueYear, url } = certificate
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
      await editCertificate({
        ...values,
        certificateId: certificate._id,
      })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Certificado editado")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao editar certificado")
    },
  })

  const handleRemoveCertificate = useMutation({
    mutationFn: async (academicFormationId) => {
      await deleteCertificate(academicFormationId)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(["user-info", userId])
      setShowModal("")
      toast.success("Certificado removido")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Erro ao remover certificado")
    },
  })

  function handleShowCertificate() {
    window.open(url, "_blank")
  }

  const defaultValues = {
    name,
    institution,
    issueMonth,
    issueYear,
    url,
  }

  return (
    <div
      className="certificate-item"
      style={
        !isLast ? { paddingBottom: 10, borderBottom: "1px solid #d9d9d9" } : {}
      }
    >
      <header>
        <div>
          <FileBadge />
        </div>
        <div className="certificate-item__info-container">
          <h3 className="certificate-item__name">{name}</h3>
          {canEdit && !isMobile && (
            <>
              <button
                className="profile__action-button-section"
                aria-label="Editar certificado"
                style={{ position: "absolute", marginRight: 0, marginTop: 0 }}
                onClick={() => setShowModal("edit")}
              >
                <Pencil />
              </button>
              <button
                className="profile__action-button-section"
                aria-label="Remover certificado"
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
                buttonLabel="Abrir opções do certificado"
              >
                <MoreVertical />
              </Dropdown>
            </div>
          )}
          <p className="certificate-item__institution">{institution}</p>
          <p className="certificate-item__period">
            {formatCertificateDate({ month: issueMonth, year: issueYear })}
          </p>
          <Button
            styleType="outlined"
            style={{
              width: "fit-content",
              whiteSpace: "nowrap",
              height: 32,
              borderRadius: 16,
              marginTop: 4,
            }}
            rightIcon={<ArrowUpRightSquare />}
            onClick={handleShowCertificate}
          >
            Exibir certificado
          </Button>
        </div>
      </header>
      <ModalForm
        title="Editar certificado"
        formFields={certificateFields}
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
          title: "Excluir certificado",
          descriptionText: "Tem certeza que deseja excluir este certificado?",
          confirmText: "Excluir",
        }}
        actionIsLoading={handleRemoveCertificate.isLoading}
        onCloseModal={() => setShowModal("")}
        onConfirm={() => handleRemoveCertificate.mutate(certificate._id)}
      />
    </div>
  )
}

export default CertificateItem
