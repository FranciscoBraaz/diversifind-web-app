import { useEffect, useRef } from "react"
import "./index.scss"
import { useWatch } from "react-hook-form"

function UncontrolledTextarea({ register, errors, control, formField }) {
  const {
    label,
    name,
    type,
    placeholder,
    regex,
    hasLabel,
    required,
    maxHeight = 200,
    rows = 5,
  } = formField
  const { ref, value, ...rest } = register(name, {
    required: {
      value: required ? true : false,
      message: `${label} é um campo necessário`,
    },
    pattern: {
      value: regex ? new RegExp(regex) : null,
      message: "Campo inválido",
    },
  })
  const textareaValue = useWatch({ control, name })
  const textAreaRef = useRef()
  const wrapperRef = useRef(null)

  useEffect(() => {
    const currentTextArea = textAreaRef?.current
    const currentWrapper = wrapperRef?.current

    if (currentTextArea) {
      currentWrapper.dataset.replicatedValue = currentTextArea.value
    }
  }, [textareaValue])

  function returnClassName() {
    let className = "uncontrolled-textarea-container"

    if (errors[name]) className += " uncontrolled-textarea-container--error"

    return className
  }

  return (
    <div className="uncontrolled-textarea__wrapper">
      {hasLabel && (
        <label htmlFor={name}>
          {label} {required && "*"}
        </label>
      )}
      <div className={returnClassName()} ref={wrapperRef} style={{ maxHeight }}>
        <textarea
          id={name}
          {...rest}
          className="uncontrolled-textarea"
          ref={(element) => {
            ref(element)
            textAreaRef.current = element
          }}
          value={value}
          name={name}
          type={type}
          placeholder={placeholder}
          rows={rows}
        />
        {errors[name] && (
          <span className="uncontrolled-textarea__error-message">
            {errors[name].message}
          </span>
        )}
      </div>
    </div>
  )
}

export default UncontrolledTextarea
