import { useFormContext, useWatch } from "react-hook-form"

// Schemas
import {
  accessibilityAccomodationFields,
  accessibilityInterviewFields,
  accessibilityWorkFields,
} from "./formFields"

// Custom hooks
import { useRenderFormFields } from "../../../../hooks/useRenderFormFields"

// Components
import Button from "../../../../components/Button"

// Styles
import "./index.scss"

function AccessibilityInfo({ isEdit, isSubmiting, goBack, onConfirm }) {
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
  const typeLocation = useWatch({ name: "typeLocation" })

  return (
    <div className="accessibility-info">
      <h2>Informações relacionadas a acessibilidade</h2>
      <form onSubmit={handleSubmit(onConfirm)} id="accessibility-info-form">
        <section className="accessibility-info__selective-process">
          <h6>
            Considerando as possíveis etapas do processo seletivo (entrevistas,
            dinâmicas, testes técnicos, etc.), informe:
          </h6>
          <p>
            As etapas do processo seletivo possuem recursos de acessibilidade
            que atendem as seguintes condições:
          </p>
          {accessibilityInterviewFields.map((field) => renderFormFields(field))}
        </section>
        <section className="accessibility-info__work">
          <h6>Considerando as tarefas e funções do cargo, informe:</h6>
          <p>
            A instituição oferece recursos de acessibilidade que atendem as
            seguintes condições:
          </p>
          {accessibilityWorkFields.map((field) => renderFormFields(field))}
        </section>
        {typeLocation === "onsite" && (
          <section className="accessibility-info__accommodation">
            <h6>
              Como esta vaga é presencial, em relação as acomodações, informe:
            </h6>
            <p>
              As acomodações possuem os seguintes recursos de acessibilidade:
            </p>
            {accessibilityAccomodationFields.map((field) =>
              renderFormFields(field),
            )}
          </section>
        )}
      </form>
      <footer>
        <Button
          type="button"
          styleType="outlined"
          style={{ width: "fit-content" }}
          disabled={isSubmiting}
          onClick={goBack}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          styleType="contained"
          isLoading={isSubmiting}
          disabled={isSubmiting}
          form="accessibility-info-form"
          style={{ width: "fit-content" }}
        >
          {isEdit ? "Salvar" : "Cadastrar"}
        </Button>
      </footer>
    </div>
  )
}

export default AccessibilityInfo
