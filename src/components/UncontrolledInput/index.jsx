import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

// Styles
import "./index.scss"

function UncontrolledInput({ register, errors, formField }) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    label,
    name,
    type,
    placeholder,
    regex,
    regexErrorMessage,
    required,
    maxLength = 1000,
  } = formField
  const { ref, value, ...rest } = register(name, {
    required: {
      value: required ? true : false,
      message: `${label} é um campo necessário`,
    },
    pattern: {
      value: regex ? new RegExp(regex) : null,
      message: regexErrorMessage ?? "Campo inválido",
    },
  })

  function returnInputClassName() {
    let className = "uncontrolled-input"

    if (errors[name]) className += " uncontrolled-input--error"

    return className
  }

  function returnInputType() {
    if (type === "password" && showPassword) return "text"

    return type
  }

  return (
    <div className="uncontrolled-input-container">
      <label htmlFor={name}>
        {label} {required && "*"}
      </label>
      <input
        {...rest}
        id={name}
        className={returnInputClassName()}
        ref={ref}
        value={value}
        name={name}
        maxLength={maxLength}
        type={returnInputType()}
        placeholder={placeholder}
      />
      {errors[name] && (
        <span className="uncontrolled-input__error-message">
          {errors[name].message}
        </span>
      )}
      {type === "password" && !showPassword && (
        <button
          type="button"
          aria-label="Mostrar senha"
          className="uncontrolled-input__eye-off"
          onClick={() => setShowPassword(true)}
        >
          <EyeOff />
        </button>
      )}
      {type === "password" && showPassword && (
        <button
          type="button"
          aria-label="Esconder senha"
          className="uncontrolled-input__eye-on"
          onClick={() => setShowPassword(false)}
        >
          <Eye />
        </button>
      )}
    </div>
  )
}

export default UncontrolledInput
