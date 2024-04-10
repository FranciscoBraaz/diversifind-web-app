import { X } from "lucide-react"

// Components
import Dialog from "../../../../components/Dialog"
import Conversations from "../Conversations"

// Styles
import "./index.scss"

function ModalHeader({ onClose }) {
  return (
    <div className="community-modal__dialog-header dialog-conversations__header">
      <h2>Conversas</h2>
      <button onClick={onClose}>
        <X />
      </button>
    </div>
  )
}

function ModalContent({ selectedConversation, setSelectedConversation }) {
  return (
    <div className="dialog-conversations__container">
      <Conversations
        searchBarBg="#f2f2f2"
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />
    </div>
  )
}

function DialogConversations({
  open,
  setSelectedConversation,
  selectedConversation,
  onClose,
}) {
  return (
    <Dialog
      open={open}
      header={<ModalHeader onClose={onClose} />}
      content={
        <ModalContent
          setSelectedConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
        />
      }
      position={{ top: "0", right: "0" }}
      // withoutAnimation
      contentStyle={{
        width: "100%",
        height: "100%",
        maxWidth: "280px",
        maxHeight: "100vh",
        padding: "16px",
      }}
    />
  )
}

export default DialogConversations
