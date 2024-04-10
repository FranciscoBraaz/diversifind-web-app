import { useEffect } from "react"
import { useController, useWatch } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import _ from "lodash"

// Custom hooks
import { useCheckRenderCondition } from "../../hooks/useCheckRenderCondition"

// Components
import CustomIcon from "../CustomIcon"

// Styles
import "./index.scss"

function checkRequired(required, fieldWatchedValue) {
  if (typeof required !== "function") return required

  return required(fieldWatchedValue)
}

function checkDisabled(disabled, fieldWatchedValue) {
  if (typeof disabled !== "function") return disabled

  return disabled(fieldWatchedValue)
}

function UncontrolledSelectDefault({
  formField,
  clearErrors,
  getValues,
  setValue,
}) {
  const {
    name,
    options = [],
    label,
    required,
    route,
    disabled,
    withoutLabel = false,
    hasTransparent = false,
    resetWhenDisabled,
    renderConditions,
    dependencyFor,
    dependentOn,
    getOptions,
  } = formField
  const fieldRelated = useWatch({
    name: dependentOn ?? "none",
    defaultValue: "",
    exact: true,
  })

  const isVisible = useCheckRenderCondition(renderConditions, getValues)
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    rules: {
      required: {
        value: isVisible ? checkRequired(required, fieldRelated) : false,
        message: `${label} é um campo necessário`,
      },
    },
  })

  const isDisabled = checkDisabled(disabled, fieldRelated)

  const { isLoading, data, isFetching } = useQuery({
    queryKey: [name, fieldRelated],
    queryFn: () => fetchOptions(),
    staleTime: 1000 * 60 * 10,
    enabled: !_.isEmpty(route) && fieldRelated !== undefined,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  /* Reset field value when isVisible is false */
  useEffect(() => {
    if (!isVisible && getValues(name)) {
      setValue(name, "")
    }
  }, [isVisible, name, setValue, getValues])

  useEffect(() => {
    if (isDisabled && resetWhenDisabled) {
      onChange("")
      clearErrors(name)
    }
  }, [isDisabled, resetWhenDisabled, name, clearErrors, onChange])

  async function fetchOptions() {
    if (!route) return
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

  function returnDefaultOption(fieldOptions) {
    if ((isLoading || isFetching) && route) return "Carregando..."

    if (_.isEmpty(fieldOptions)) return "Nada encontrado"

    return "Selecione"
  }

  function returnContainerClassName() {
    let className = "uncontrolled-select-default__container"

    if (isDisabled)
      className += " uncontrolled-select-default__container--disabled"

    return className
  }

  function defineArrowPosition() {
    if (error) return "5px"

    if (withoutLabel) return "0px"

    return "15px"
  }

  const selectOptions = _.isEmpty(data) ? options : data

  if (!isVisible) return null

  return (
    <div className={returnContainerClassName()}>
      {!withoutLabel && (
        <label htmlFor={name} className="uncontrolled-select-default__label">
          {label} {required && "*"}
        </label>
      )}
      <select
        id={name}
        aria-label="Selecionar opções"
        className="uncontrolled-select-default"
        value={value ?? ""}
        disabled={isDisabled || isLoading || isFetching}
        style={{ backgroundColor: hasTransparent ? "transparent" : "white" }}
        onChange={(e) => {
          onChange(e)
          if (dependencyFor?.length > 0) {
            dependencyFor.forEach((dependency) => {
              setValue(dependency, "")
            })
          }
        }}
      >
        <option value="">{returnDefaultOption(selectOptions)}</option>
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <CustomIcon
        icon="ChevronDown"
        style={{
          marginTop: defineArrowPosition(),
          color: hasTransparent ? "#959595" : "#3b3b3b",
        }}
        className="uncontrolled-select-default__arrow"
      />
      {error && (
        <p className="uncontrolled-select-default__error-message">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default UncontrolledSelectDefault
