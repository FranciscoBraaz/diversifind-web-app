import { useFormContext } from "react-hook-form"

// Schemas
import { initialInfoFields } from "./formFields"

// Custom hooks
import { useRenderFormFields } from "../../../../hooks/useRenderFormFields"

// Components
import Button from "../../../../components/Button"

// Styles
import "./index.scss"

function InitialInfo({ onConfirm }) {
  const {
    register,
    formState: { errors },
    clearErrors,
    getValues,
    setValue,
    handleSubmit,
  } = useFormContext()
  const { renderFormFields } = useRenderFormFields({
    register,
    errors,
    clearErrors,
    getValues,
    setValue,
  })

  return (
    <div className="initial-info">
      <h2>Informações iniciais</h2>
      <form onSubmit={handleSubmit(onConfirm)} id="initial-info-form">
        {initialInfoFields.map((field) => renderFormFields(field))}
      </form>
      <footer>
        <Button
          type="submit"
          styleType="contained"
          form="initial-info-form"
          style={{ width: "fit-content" }}
        >
          Avançar
        </Button>
      </footer>
    </div>
  )
}

export default InitialInfo
