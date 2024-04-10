import { useEffect } from "react"
import { toast } from "react-toastify"
import { X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"

// Services
import { createCommunity, editCommunity } from "../../services/communityService"

// Custom hooks
import { useRenderFormFields } from "../../hooks/useRenderFormFields"

// Schemas
import { communityFields } from "./formFields"

// Components
import Dialog from "../Dialog"
import Button from "../Button"

// Styles
import "./index.scss"

function ModalHeader({ title, isLoading, onClose }) {
  return (
    <div className="community-modal__dialog-header">
      <h2>{title}</h2>
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={isLoading ? undefined : onClose}
        disabled={isLoading}
      >
        <X />
      </button>
    </div>
  )
}

function ModalContent({ fields = [], isEditing, communityInfo, onClose }) {
  const methods = useForm()
  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = methods
  const queryClient = useQueryClient()
  const { renderFormFields } = useRenderFormFields({
    register,
    clearErrors,
    errors,
    getValues,
    setValue,
  })

  useEffect(() => {
    let formData = {}
    if (communityInfo) {
      formData["name"] = communityInfo.name
      formData["description"] = communityInfo.description
      formData["platform"] = communityInfo.platform
      formData["link"] = communityInfo.link
      formData["professionalArea"] = communityInfo.professionalArea._id
      formData["skills"] = communityInfo.skills.map((skill) => skill._id)

      reset(formData)
    }
  }, [communityInfo, reset])

  const submitCreateForm = useMutation({
    mutationFn: async (data) => {
      await createCommunity(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          ["my-communities", "communities"].includes(query.queryKey[0]),
      })
      toast.success("A comunidade foi criada")
      onClose()
    },
    onError: (error) => {
      console.error("Erro criar comunidade: ", error)
      toast.error("Erro ao criar a comunidade")
    },
  })

  const submitEditForm = useMutation({
    mutationFn: async ({ communityId, values }) => {
      await editCommunity(communityId, values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) =>
          ["my-communities", "communities"].includes(query.queryKey[0]),
      })
      toast.success("As alterações foram salvas")
      onClose()
    },
    onError: (error) => {
      console.error("Erro ao editar comunidade: ", error)
      toast.error("Erro ao editar a comunidade")
    },
  })

  const isLoading = submitCreateForm.isPending || submitEditForm.isPending
  return (
    <main className="community-modal__dialog-content">
      <FormProvider {...methods}>
        <form
          className="community-modal__dialog-content__form"
          onSubmit={
            isEditing
              ? handleSubmit((values) =>
                  submitEditForm.mutate({
                    communityId: communityInfo._id,
                    values,
                  }),
                )
              : handleSubmit(submitCreateForm.mutate)
          }
        >
          <div>{fields.map((field) => renderFormFields(field))}</div>
          <div className="community-modal__dialog-content__buttons">
            <Button
              type="button"
              styleType="outlined"
              disabled={isLoading}
              onClick={isLoading ? undefined : onClose}
              style={{ width: "fit-content" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              styleType="contained"
              disabled={isLoading}
              isLoading={isLoading}
              style={{ width: "fit-content" }}
            >
              Salvar
            </Button>
          </div>
        </form>
      </FormProvider>
    </main>
  )
}

function CommunityModal({ open, communityInfo, isEditing, onClose }) {
  return (
    <Dialog
      open={open}
      header={<ModalHeader title="Criar comunidade" onClose={onClose} />}
      content={
        <ModalContent
          onClose={onClose}
          fields={communityFields}
          communityInfo={communityInfo}
          isEditing={isEditing}
        />
      }
      position={{ top: "50%", left: "50%" }}
      dataSide="center"
      overlayColor="rgba(0, 0, 0, 0.3)"
      contentStyle={{
        width: "100%",
        height: "100%",
        maxWidth: 774,
        maxHeight: "85vh",
        transform: "translate(-50%, -50%)",
        padding: "16px 0px",
      }}
    />
  )
}

export default CommunityModal
