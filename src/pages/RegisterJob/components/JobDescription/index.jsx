import { useFormContext } from "react-hook-form"

// Components
import Button from "../../../../components/Button"

// Schemas
import { descriptionFields } from "./formFields"

// Custom hooks
import { useRenderFormFields } from "../../../../hooks/useRenderFormFields"

// Styles
import "./index.scss"

function JobDescription({ goBack, onConfirm }) {
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
    <div className="job-description">
      <h2>Fale-nos sobre o cargo</h2>
      <form onSubmit={handleSubmit(onConfirm)} id="job-description-form">
        {descriptionFields.map((field) => renderFormFields(field))}
      </form>
      <footer>
        <Button
          type="button"
          styleType="outlined"
          style={{ width: "fit-content" }}
          onClick={goBack}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          styleType="contained"
          form="job-description-form"
          style={{ width: "fit-content" }}
        >
          Avançar
        </Button>
      </footer>
    </div>
  )
}

export default JobDescription
