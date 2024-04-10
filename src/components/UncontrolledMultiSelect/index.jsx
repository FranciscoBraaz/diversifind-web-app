import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useController, useWatch } from "react-hook-form"
import Select from "react-select"
import _ from "lodash"

function checkRequired(required, fieldWatchedValue) {
  if (typeof required !== "function") return required

  return required(fieldWatchedValue)
}

function checkDisabled(disabled, fieldWatchedValue) {
  if (typeof disabled !== "function") return disabled

  return disabled(fieldWatchedValue)
}

// function getLabel(value, options) {
//   if (value && value.length > 0) {
//     return value.map((item) => item.label)
//   }
//   return []
// }

// Styles
import "./index.scss"

function UncontrolledMultiSelect({ formField, clearErrors, setValue }) {
  const {
    name,
    options = [],
    label,
    ariaLabel,
    required,
    placeholder = "Selecione",
    route,
    disabled,
    resetWhenDisabled,
    dependencyFor,
    dependentOn,
    getOptions,
  } = formField
  const fieldRelated = useWatch({
    name: dependentOn ?? "none",
    defaultValue: "",
    exact: true,
  })

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    defaultValue: [],
    rules: {
      required: {
        value: checkRequired(required, fieldRelated),
        message: `${label} é um campo necessário`,
      },
    },
  })

  const isDisabled = checkDisabled(disabled, fieldRelated)

  const { isLoading, data } = useQuery({
    queryKey: [name, fieldRelated],
    queryFn: () => fetchOptions(),
    staleTime: 1000 * 60 * 10,
    enabled: !_.isEmpty(route) && dependentOn && fieldRelated !== undefined,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  useEffect(() => {
    if (isDisabled && resetWhenDisabled) {
      onChange("")
      clearErrors(name)
    }
  }, [isDisabled, resetWhenDisabled, name, clearErrors, onChange])

  async function fetchOptions() {
    if (dependentOn && !fieldRelated) return []

    try {
      const url = route.replace("paramValue", fieldRelated)
      const data = await getOptions(url)

      return !_.isEmpty(data) ? data : []
    } catch (error) {
      // console.log(error)
      return []
    }
  }

  const selectOptions = _.isEmpty(data) ? options : data

  return (
    <div className="uncontrolled-multi-select__container">
      <label htmlFor={name}>{label}</label>
      <Select
        id={name}
        className="uncontrolled-multi-select"
        classNamePrefix="uncontrolled-multi-select"
        styles={{
          option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? "#dcf2f0" : "white",
            cursor: "pointer",
          }),
          indicatorsContainer: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isFocused ? "initial" : "#6d6d6d",
            cursor: "pointer",
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            color: "#6d6d6d",
          }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            boxShadow: state.isFocused
              ? "0 0 0 1px #26a69a!important"
              : "unset !important",
            borderColor: state.isFocused ? "#26a69a !important" : "#d9d9d9",
          }),
        }}
        value={selectOptions.filter(({ value: selectValue }) =>
          value.includes(selectValue),
        )}
        getOptionLabel={({ label }) => label}
        getOptionValue={({ value }) => value}
        onChange={(item) => {
          onChange(item.map((item) => item.value))
          if (dependencyFor) {
            setValue(dependencyFor, "")
          }
        }}
        noOptionsMessage={() => "Nenhuma opção encontrada"}
        options={selectOptions}
        aria-label={ariaLabel ?? label}
        isDisabled={isDisabled}
        name={name}
        placeholder={isLoading ? "Carregando..." : placeholder}
        isMulti
      />
      {error && (
        <span className="uncontrolled-select__error-message">
          {error.message}
        </span>
      )}
    </div>
  )
}

export default UncontrolledMultiSelect
