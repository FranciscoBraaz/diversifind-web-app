import { X } from "lucide-react"

// Components
import Filters from "../Filters"
import Dialog from "../../../../components/Dialog"

// Styles
import "./index.scss"

function ModalHeader({ onClose }) {
  return (
    <div className="community-modal__dialog-header dialog-filters__header">
      <h2>Filtrar</h2>
      <button onClick={onClose}>
        <X />
      </button>
    </div>
  )
}

function ModalContent({ onNavigate }) {
  return (
    <div className="dialog-filters__container">
      <Filters onNavigate={onNavigate} />
    </div>
  )
}

function DialogFilters({ open, onNavigate, onClose }) {
  return (
    <Dialog
      open={open}
      header={<ModalHeader onClose={onClose} />}
      content={<ModalContent onClose={onClose} onNavigate={onNavigate} />}
      position={{ top: "0", right: "0" }}
      withoutAnimation
      overlayColor="rgba(0, 0, 0, 0.5)"
      contentStyle={{
        width: "100%",
        height: "100%",
        maxWidth: "240px",
        maxHeight: "100vh",
        padding: "16px",
      }}
    />
  )
}

export default DialogFilters
