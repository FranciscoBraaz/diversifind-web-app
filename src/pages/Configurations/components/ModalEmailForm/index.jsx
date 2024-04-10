import { FormProvider, useForm, useFormContext } from "react-hook-form"
import Dialog from "../../../../components/Dialog"
import { X } from "lucide-react"
import Button from "../../../../components/Button"
import { useRenderFormFields } from "../../../../hooks/useRenderFormFields"

import "./index.scss"
import { useState } from "react"
import { toast } from "react-toastify"
import { sendCodeToEmail, updateEmail } from "../../../../services/authServices"
import { parseLocalStorageJson } from "../../../../utils"
import { useDispatch } from "react-redux"

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
  step,
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
    <section className="modal-email-form__dialog-content">
      {step === 1 && <p>Vamos enviar um código para o seu novo e-mail</p>}
      {step === 2 && <p>Insira no campo abaixo o código recebido no e-mail</p>}
      <form
        className="modal-email-form__dialog-content__form"
        onSubmit={isLoading ? undefined : handleSubmit(onConfirm)}
      >
        <div>{fields.map((field) => renderFormFields(field))}</div>
        <div className="modal-email-form__dialog-content__buttons">
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

function ModalEmailForm({ emailFields, codeFields, open, onClose }) {
  const user = parseLocalStorageJson("diversiFindUser")
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const dispatch = useDispatch()

  const methods = useForm({
    mode: `onBlur`,
  })

  async function sendCode() {
    try {
      setIsLoading(true)
      const data = methods.getValues()
      await sendCodeToEmail({
        currentEmail: user?.email,
        newEmail: data.newEmail,
      })
      setNewEmail(data.newEmail)
      setStep(2)
      toast.success("Um código foi enviado para o seu e-mail")
    } catch (error) {
      // console.log(error)
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Erro ao enviar código")
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function changeEmail() {
    try {
      setIsLoading(true)
      const data = methods.getValues()
      await updateEmail({
        currentEmail: user?.email,
        newEmail: newEmail,
        code: data.code,
      })

      const newUser = { ...user, email: newEmail }
      localStorage.setItem("diversiFindUser", JSON.stringify(newUser))
      dispatch({ type: "CHANGE_USER", payload: newUser })

      toast.success("E-mail alterado")
      handleClose()
    } catch (error) {
      // console.log(error)
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Erro ao enviar código")
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    setStep(1)
    setNewEmail("")
    methods.reset({ newEmail: "", code: "" })
    onClose()
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
            fields={step === 1 ? emailFields : codeFields}
            isLoading={isLoading}
            onConfirmTitle={step === 1 ? "Enviar código" : "Confirmar"}
            step={step}
            onClose={handleClose}
            onConfirm={step === 1 ? sendCode : changeEmail}
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

export default ModalEmailForm
