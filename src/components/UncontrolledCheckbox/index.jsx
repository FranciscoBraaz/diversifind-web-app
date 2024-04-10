import { forwardRef, useRef } from "react"
import { Info } from "lucide-react"

// Components
import Tooltip from "../Tooltip"

// Styles
import "./index.scss"

const TooltipTrigger = forwardRef(({ props }, ref) => {
  return (
    <button ref={ref} {...props} className="checkbox__tooltip-trigger"></button>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

function TooltipContent({ message }) {
  return (
    <div className="checkbox__tooltip-content">
      <p>{message}</p>
    </div>
  )
}

export default function UncontrolledCheckbox({
  register = () => {},
  errors = {},
  formField,
  checked,
}) {
  const {
    name,
    type = "checkbox",
    label = "",
    required = false,
    id = name,
    styleProps = {},
    disabled = false,
    hasTooltip = false,
    tooltipMessage = "",
  } = formField
  const inputRef = useRef(null)
  const { ref, ...rest } = register(name, {
    required: {
      value: required ? true : false,
      message: `${label} é um campo necessário`,
    },
    pattern: {
      message: "Campo inválido",
    },
  })

  return (
    <div className="form__checkbox--container" style={{ ...styleProps }}>
      <input
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
        type={type}
        className={`form__checkbox ${
          errors[name] ? "form__checkbox--error" : ""
        }`}
        id={id}
        disabled={disabled}
        checked={checked}
      />
      <div className="form__checkbox__label-container">
        <label htmlFor={id} className="form__label--checkbox">
          {label} {required && "*"}
        </label>
        {hasTooltip && (
          <Tooltip
            trigger={<Info size={18} />}
            content={<TooltipContent message={tooltipMessage} />}
          />
        )}
      </div>
      {errors[name] && (
        <p className="form__checkbox--error-message">{errors[name].message}</p>
      )}
    </div>
  )
}
