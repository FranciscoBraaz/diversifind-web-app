import { useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { X } from "lucide-react"
import { toast } from "react-toastify"

// Custom hooks
import { useRenderFormFields } from "../../../../hooks/useRenderFormFields"

// Services
import { updatePassword } from "../../../../services/authServices"

// Components
import Button from "../../../../components/Button"
import Dialog from "../../../../components/Dialog"

// Styles
import "./index.scss"

function DialogHeader({ title, isLoading, onClose }) {
  return (
    <div className="modal-form__dialog-header">
      <h2>{title}</h2>
      <button onClick={isLoading ? undefined : onClose} disabled={isLoading}>
        <X />
      </button>
    </div>
  )
}

function DialogContent({
  fields = [],
  isLoading,
  onConfirmTitle,
  onClose,
  onConfirm,
}) {
  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    getValues,
    setValue,
  } = useFormContext()

  const { renderFormFields } = useRenderFormFields({
    register,
    clearErrors,
    errors,
    getValues,
    setValue,
  })

  return (
    <section className="modal-password-form__dialog-content">
      <form
        className="modal-password-form__dialog-content__form"
        onSubmit={isLoading ? undefined : handleSubmit(onConfirm)}
      >
        <div>{fields.map((field) => renderFormFields(field))}</div>
        <div className="modal-password-form__dialog-content__buttons">
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
            {onConfirmTitle}
          </Button>
        </div>
      </form>
    </section>
  )
}

function ModalPasswordForm({ open, passwordFields, onClose }) {
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm({
    mode: `onBlur`,
  })

  function handleClose() {
    methods.reset({ currentPassword: "", newPassword: "", confirmPassword: "" })
    onClose()
  }

  async function changePassword(data) {
    try {
      if (data.newPassword !== data.confirmPassword) {
        methods.setError("confirmPassword", {
          type: "manual",
          message: "As senhas não coincidem",
        })
        return
      }

      setIsLoading(true)
      const body = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }
      await updatePassword(body)
      setIsLoading(false)
      toast.success("Senha alterada")
      handleClose()
    } catch (error) {
      // console.log(error)
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Erro ao enviar código")
      }
      setIsLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        header={
          <DialogHeader
            title="Alterar e-mail"
            onClose={handleClose}
            isLoading={isLoading}
          />
        }
        content={
          <DialogContent
            fields={passwordFields}
            isLoading={isLoading}
            onConfirmTitle={"Alterar senha"}
            onClose={handleClose}
            onConfirm={changePassword}
          />
        }
        position={{ top: "50%", left: "50%" }}
        dataSide="center"
        withoutAnimation
        contentStyle={{
          width: "100%",
          height: "100%",
          maxWidth: 774,
          maxHeight: "60vh",
          transform: "translate(-50%, -50%)",
          padding: "16px 0px",
        }}
      />
    </FormProvider>
  )
}

export default ModalPasswordForm
