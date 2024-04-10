import { useEffect } from "react"
import { X } from "lucide-react"

// Hooks
import { useRenderFormFields } from "../../../../hooks/useRenderFormFields"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"

// Components
import Dialog from "../../../../components/Dialog"
import Button from "../../../../components/Button"

// Styles
import "./index.scss"
import { createDateWithMonthAndYear } from "../../../../utils"

function DialogHeader({ title, isLoading, onClose }) {
  return (
    <div className="modal-form__dialog-header">
      <h2>{title}</h2>
      <button
        onClick={isLoading ? undefined : onClose}
        disabled={isLoading}
        aria-label="Fechar modal"
      >
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
    <section className="modal-form__dialog-content">
      <form
        className="modal-form__dialog-content__form"
        onSubmit={isLoading ? undefined : handleSubmit(onConfirm)}
      >
        <div>{fields.map((field) => renderFormFields(field))}</div>
        <div className="modal-form__dialog-content__buttons">
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

function ModalForm({
  open = false,
  title,
  formFields,
  isLoading,
  defaultValues,
  onClose,
  onConfirm,
  onConfirmTitle = "Salvar",
  maxWidth = 774,
  maxHeight = "85vh",
  ariaLabelReference,
}) {
  const methods = useForm({
    mode: `onBlur`,
  })

  const dateFields = useWatch({
    control: methods.control,
    name: ["startDateMonth", "startDateYear", "endDateMonth", "endDateYear"],
    defaultValue: "",
  })

  useEffect(() => {
    if (!open && defaultValues) {
      methods.reset(defaultValues)
    }
  }, [open, defaultValues, methods])

  useEffect(() => {
    if (open) {
      const allDateFieldsFilled = dateFields.every((field) => field !== "")
      if (allDateFieldsFilled) {
        let startDate = createDateWithMonthAndYear(dateFields[0], dateFields[1])
        let endDate = createDateWithMonthAndYear(dateFields[2], dateFields[3])

        if (endDate < startDate) {
          methods.setError("endDateYear", {
            type: "manual",
            message: "A data final não pode ser menor que a inicial",
          })
        }

        const { errors } = methods.formState
        if (startDate <= endDate && errors["endDateYear"]) {
          methods.clearErrors("endDateYear")
        }
      }
    }
  }, [dateFields, open, methods])

  function handleClose() {
    methods.reset()
    onClose()
  }

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        ariaLabelReference={ariaLabelReference}
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
            onConfirmTitle={onConfirmTitle}
            onClose={handleClose}
            onConfirm={onConfirm}
          />
        }
        position={{ top: "50%", left: "50%" }}
        dataSide="center"
        overlayColor="rgba(0, 0, 0, 0.3)"
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
