import { useEffect, useState } from "react"
import { ArrowUpRightSquare, X } from "lucide-react"

// Hooks
import { FormProvider, useForm, useFormContext } from "react-hook-form"

// Components
import Dialog from "../../../../components/Dialog"
import Button from "../../../../components/Button"

// Styles
import "./index.scss"
import UncontrolledInput from "../../../../components/UncontrolledInput"
import UploadResume from "../../../Profile/components/UploadResume"
import { parseLocalStorageJson } from "../../../../utils"

function DialogHeader({ title, isLoading, onClose }) {
  return (
    <div className="candidature__modal-form__dialog-header">
      <h2>{title}</h2>
      <button onClick={isLoading ? undefined : onClose} disabled={isLoading}>
        <X />
      </button>
    </div>
  )
}

function DialogContent({ fields = [], isLoading, onClose, onConfirm }) {
  const user = parseLocalStorageJson("diversiFindUser")
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext()
  const [userResumeUrl, setUserResumeUrl] = useState(user.resumeUrl)

  useEffect(() => {
    if (user.email) {
      setValue("email", user.email)
    }
  }, [user, setValue])

  function handleOpenResume() {
    window.open(userResumeUrl, "_blank")
  }

  return (
    <main className="candidature__modal-form__dialog-content">
      <form
        className="candidature__modal-form__dialog-content__form"
        onSubmit={isLoading ? undefined : handleSubmit(onConfirm)}
      >
        <div className="candidature__modal-form__dialog-content__form__container-inner">
          <UncontrolledInput
            register={register}
            errors={errors}
            formField={{ ...fields.email }}
          />
          {userResumeUrl ? (
            <p>Você já possui um currículo carregado na plataforma</p>
          ) : (
            <p>Você ainda não possui um currículo carregado na plataforma</p>
          )}
          <div>
            {userResumeUrl && (
              <Button
                styleType="contained"
                onClick={handleOpenResume}
                style={{ width: "fit-content", height: 35, gap: 8 }}
                rightIcon={<ArrowUpRightSquare />}
              >
                Visualizar currículo
              </Button>
            )}
            <UploadResume
              text={userResumeUrl ? "Atualizar CV" : "Enviar currículo"}
              icon={userResumeUrl ? "RefreshCcw" : "Upload"}
              userId={user._id}
              customAction={setUserResumeUrl}
            />
          </div>
        </div>
        <div className="candidature__modal-form__dialog-content__buttons">
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
    </main>
  )
}

function ModalForm({
  open = false,
  title,
  formFields,
  isLoading,
  defaultValues,
  onClose,
  onConfirm,
  maxWidth = "774px",
  maxHeight = "85vh",
}) {
  const methods = useForm({
    mode: `onBlur`,
  })

  useEffect(() => {
    if (!open && defaultValues) {
      methods.reset(defaultValues)
    }
  }, [open, defaultValues, methods])

  function handleClose() {
    methods.reset()
    onClose()
  }

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        header={
          <DialogHeader
            title={title}
            onClose={handleClose}
            isLoading={isLoading}
          />
        }
        content={
          <DialogContent
            fields={formFields}
            isLoading={isLoading}
            onClose={handleClose}
            onConfirm={onConfirm}
          />
        }
        position={{ top: "50%", left: "50%" }}
        dataSide="center"
        overlayColor="rgba(0, 0, 0, 0.3)"
        withoutAnimation
        contentStyle={{
          width: "100%",
          height: "100%",
          maxWidth,
          maxHeight,
          transform: "translate(-50%, -50%)",
          padding: "16px 0px",
        }}
      />
    </FormProvider>
  )
}

export default ModalForm
