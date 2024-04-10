import { X } from "lucide-react"
import { Oval } from "react-loader-spinner"

// Components
import Button from "../Button"
import Dialog from "../Dialog"

// Styles
import "./index.scss"

function DialogHeader({ title, onClose }) {
  return (
    <header className="confirmation-modal__header">
      <h2>{title}</h2>
      <button onClick={onClose} aria-label="Fechar modal">
        <X />
      </button>
    </header>
  )
}

function DialogContent({
  descriptionText,
  confirmText,
  actionIsLoading,
  onClose,
  onConfirm,
  type,
}) {
  return (
    <div className="comment-delete-modal__content">
      <p>{descriptionText}</p>
      <footer>
        <Button
          onClick={onClose}
          styleType="outlined"
          style={{
            width: "fit-content",
            height: 40,
            color: type === "confirmation" ? "#007a7c" : "#6d6d6d",
            borderColor: type === "confirmation" ? "#007a7c" : "#6d6d6d",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          styleType="contained"
          style={{
            width: "fit-content",
            height: 40,
            backgroundColor: type === "confirmation" ? "#007a7c" : "#E7241B",
          }}
        >
          {actionIsLoading ? (
            <Oval
              visible={true}
              height="20"
              width="20"
              color="#fff"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            confirmText
          )}
        </Button>
      </footer>
    </div>
  )
}

function ConfirmationModal({
  open,
  actionIsLoading,
  onConfirm,
  onCloseModal,
  type = "confirmation",
  options = {
    title: "Ação",
    descriptionText: "Tem certeza que deseja tomar esta ação?",
    confirmText: "Confirmar",
  },
}) {
  return (
    <Dialog
      open={open}
      header={<DialogHeader title={options.title} onClose={onCloseModal} />}
      content={
        <DialogContent
          descriptionText={options.descriptionText}
          confirmText={options.confirmText}
          onClose={onCloseModal}
          onConfirm={onConfirm}
          actionIsLoading={actionIsLoading}
          type={type}
        />
      }
      position={{ top: "50%", left: "50%" }}
      dataSide="center"
      withoutAnimation
      contentStyle={{
        maxWidth: 555,
        maxHeight: 200,
        transform: "translate(-50%, -50%)",
        padding: "16px 0px",
      }}
      overlayColor="rgba(0, 0, 0, 0.3)"
    />
  )
}

export default ConfirmationModal
