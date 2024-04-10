import { useEffect, useRef, useState } from "react"

import "./index.scss"

export default function FormInput({
  value = "",
  id,
  placeholder,
  required,
  disabled = false,
  maxLength = 3000,
  onChange,
}) {
  const textAreaRef = useRef()
  const wrapperRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const currentTextArea = textAreaRef?.current
    const currentWrapper = wrapperRef?.current

    if (currentTextArea) {
      currentWrapper.dataset.replicatedValue = currentTextArea.value
    }
  }, [value])

  function returnClassName() {
    let className = "textarea-wrapper"

    if (isFocused) className += " textarea-wrapper--focused"

    return className
  }

  return (
    <div className={returnClassName()} ref={wrapperRef}>
      <textarea
        id={id}
        ref={textAreaRef}
        className="textarea"
        value={value ?? ""}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        rows={1}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
      />
    </div>
  )
}
