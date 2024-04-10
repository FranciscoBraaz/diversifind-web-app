import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"
import { Comment } from "react-loader-spinner"

// Styles
import "./index.scss"

function InputMessage({ resetValue, isSending, submitMessage }) {
  const [value, setValue] = useState("")
  const textAreaRef = useRef()
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (resetValue) {
      setValue("")
    }
  }, [resetValue])

  useEffect(() => {
    const currentTextArea = textAreaRef?.current
    const currentWrapper = wrapperRef?.current

    if (currentTextArea) {
      currentWrapper.dataset.replicatedValue = currentTextArea.value
    }
  }, [value])

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submitMessage(value)
    }
  }

  return (
    <div className="input-message__wrapper">
      <div
        className="input-message-container"
        ref={wrapperRef}
        style={{ maxHeight: 160 }}
      >
        <textarea
          className="input-message"
          ref={textAreaRef}
          value={value}
          aria-label="Digite uma mensagem"
          disabled={isSending}
          onChange={({ target }) => setValue(target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Digite uma mensagem"
          rows={1}
        />
      </div>
      <button
        onClick={isSending ? undefined : () => submitMessage(value)}
        disabled={isSending}
        type="button"
        aria-label="Enviar mensagem"
      >
        {isSending ? (
          <Comment
            visible={true}
            height="25"
            width="25"
            color="#26a69a"
            backgroundColor="#fff"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <Send size={20} />
        )}
      </button>
    </div>
  )
}

export default InputMessage
