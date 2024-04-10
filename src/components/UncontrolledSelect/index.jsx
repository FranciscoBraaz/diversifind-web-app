import { useLayoutEffect, useState, forwardRef, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useController, useWatch } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { Oval } from "react-loader-spinner"
import * as Select from "@radix-ui/react-select"
import _ from "lodash"

// Custom hooks
import { useCheckRenderCondition } from "../../hooks/useCheckRenderCondition"

// Styles
import "./index.scss"

/*
function returnLabel(options, value) {
  const selectedOption = options.find((option) => option.value === value)

  return selectedOption ? selectedOption.label : "Selecione"
}
*/

function checkRequired(required, fieldWatchedValue) {
  if (typeof required !== "function") return required

  return required(fieldWatchedValue)
}

function checkDisabled(disabled, fieldWatchedValue) {
  if (typeof disabled !== "function") return disabled

  return disabled(fieldWatchedValue)
}

function UncontrolledSelect({ formField, clearErrors, getValues, setValue }) {
  const triggerRef = useRef(null)
  const [contentWidth, setContentWidth] = useState(0)

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

  const { isLoading, data } = useQuery({
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

  useLayoutEffect(() => {
    function defineContentWidth() {
      if (!triggerRef.current) return

      const triggerWidth = triggerRef.current.getBoundingClientRect().width
      setContentWidth(triggerWidth)
    }

    defineContentWidth()
    window.addEventListener("resize", defineContentWidth)
  }, [])

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

  const selectOptions = _.isEmpty(data) ? options : data

  if (!isVisible) return null

  return (
    <Select.Root
      onValueChange={(value) => {
        if (value !== getValues(name)) {
          if (isLoading) return

          onChange(value)
          /* Resets the field value that depends on the current element  */
          dependencyFor && setValue(dependencyFor, "")
        }
      }}
      value={value}
      disabled={selectOptions.length === 0}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        ref={triggerRef}
        asChild
        disabled={isDisabled}
      >
        <div className="select-trigger__container">
          {label && (
            <p>
              {label} {required && "*"}
            </p>
          )}
          <button
            className="select-trigger"
            type="button"
            disabled={isDisabled}
          >
            <Select.Value placeholder={placeholder} />
            <Select.Icon className="select-icon">
              {isLoading ? (
                <Oval
                  visible={true}
                  height="18"
                  width="18"
                  color="#1dc690"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                <ChevronDown size={20} />
              )}
            </Select.Icon>
          </button>
          {error && (
            <span className="uncontrolled-select__error-message">
              {error.message}
            </span>
          )}
        </div>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="select-content"
          position="popper"
          sideOffset={5}
          side="bottom"
          collisionPadding={{ top: 20, bottom: 20 }}
          style={{ width: contentWidth }}
        >
          <Select.ScrollUpButton className="select-scroll-button">
            <ChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport className="select-viewport">
            {selectOptions.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="select-item"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="select-scroll-button">
            <ChevronDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <Select.Item {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
})

SelectItem.displayName = "SelectItem"

export default UncontrolledSelect
