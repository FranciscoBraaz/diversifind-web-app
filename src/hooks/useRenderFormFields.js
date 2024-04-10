// Components
import UncontrolledCheckbox from "../components/UncontrolledCheckbox"
import UncontrolledInput from "../components/UncontrolledInput"
import UncontrolledMultiSelect from "../components/UncontrolledMultiSelect"
// import UncontrolledSelect from "../components/UncontrolledSelect"
import UncontrolledSelectDefault from "../components/UncontrolledSelectDefault"
import UncontrolledTextarea from "../components/UncontrolledTextarea"

export function useRenderFormFields({
  register,
  errors,
  clearErrors,
  getValues,
  setValue,
}) {
  function renderFormFields(formField) {
    switch (formField.type) {
      case "text":
      case "password":
      case "email":
        return (
          <UncontrolledInput
            key={formField.name}
            register={register}
            errors={errors}
            formField={formField}
          />
        )
      case "textarea":
        return (
          <UncontrolledTextarea
            key={formField.name}
            register={register}
            errors={errors}
            formField={formField}
          />
        )
      case "select":
        return (
          <UncontrolledSelectDefault
            key={formField.name}
            errors={errors}
            clearErrors={clearErrors}
            formField={formField}
            getValues={getValues}
            setValue={setValue}
          />
        )
      case "multi-select":
        return (
          <UncontrolledMultiSelect
            key={formField.name}
            errors={errors}
            clearErrors={clearErrors}
            formField={formField}
            getValues={getValues}
            setValue={setValue}
          />
        )
      case "checkbox":
        return (
          <UncontrolledCheckbox
            key={formField.name}
            register={register}
            errors={errors}
            formField={formField}
          />
        )
      default:
        return null
    }
  }

  return { renderFormFields }
}
