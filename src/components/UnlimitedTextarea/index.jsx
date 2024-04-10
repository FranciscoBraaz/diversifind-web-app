import { useEffect, useRef } from "react"

import "./index.scss"

function UnlimitedTextarea({
  value,
  placeholder,
  name,
  id,
  shouldFocus = false,
  onChangeValue,
  withLabel = false,
}) {
  const textAreaRef = useRef()
  const wrapperRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      if (shouldFocus) {
        textAreaRef.current.selectionStart = value.length
        textAreaRef.current.focus()
      }
    }, 200)

    /* eslint-disable-next-line */
  }, [shouldFocus])

  useEffect(() => {
    const currentTextArea = textAreaRef?.current
    const currentWrapper = wrapperRef?.current

    if (currentTextArea) {
      currentWrapper.dataset.replicatedValue = currentTextArea.value
    }
  }, [value])

  return (
    <>
      {withLabel && (
        <label htmlFor={id} className="unlimited-textarea-label">
          Descrição da imagem:
        </label>
      )}
      <div className="unlimited-textarea-wrapper" ref={wrapperRef}>
        <textarea
          ref={textAreaRef}
          value={value ?? ""}
          onChange={(e) => onChangeValue(e.target.value)}
          onFocus={(e) => {
            e.persist()
          }}
          name={name}
          id={id}
          aria-label={placeholder}
          rows="1"
          placeholder={placeholder}
        />
      </div>
    </>
  )
}

export default UnlimitedTextarea
