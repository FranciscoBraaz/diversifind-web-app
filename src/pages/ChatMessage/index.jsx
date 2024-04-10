import { useState } from "react"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

// Components
import Menu from "../../components/Menu"
import Chat from "./components/Chat"
import Conversations from "./components/Conversations"

// Styles
import "./index.scss"
import DialogConversations from "./components/DialogConversations"
import Button from "../../components/Button"
import { MessageSquareMore } from "lucide-react"

function ChatMessage() {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const isMobile = useMedia("(max-width: 840px)")

  function handleSelectConversation(conversation) {
    setSelectedConversation(conversation)
    setShowDialog(false)
  }

  return (
    <div className="chat-message">
      <div className="chat-message-container">
        <Menu />
        <div className="chat-message__wrapper-chat">
          {isMobile && (
            <Button
              styleType="outlined"
              onClick={() => setShowDialog(true)}
              style={{
                width: "fit-content",
                gap: "8px",
                alignSelf: "flex-end",
              }}
              rightIcon={<MessageSquareMore />}
            >
              Abrir conversas
            </Button>
          )}
          <Chat
            conversationId={selectedConversation?.conversationId}
            receiver={selectedConversation?.receiver}
          />
        </div>
        {isMobile ? (
          <DialogConversations
            open={showDialog}
            onClose={() => setShowDialog(false)}
            selectedConversation={selectedConversation}
            setSelectedConversation={handleSelectConversation}
          />
        ) : (
          <Conversations
            withTitle
            selectedConversation={selectedConversation}
            setSelectedConversation={handleSelectConversation}
          />
        )}
      </div>
    </div>
  )
}

export default ChatMessage
