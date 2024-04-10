import { forwardRef } from "react"
import Avatar from "../../../../components/Avatar"

// Styles
import "./index.scss"

const Message = forwardRef(({ message, userId }, ref) => {
  const isOwner = message.sender._id === userId

  return (
    <div className={`message ${isOwner ? "message--isOwner" : ""}`} ref={ref}>
      <Avatar src={message.sender.avatar} alt={message.sender.name} />
      <p>{message.content}</p>
    </div>
  )
})
Message.displayName = "Message"

export default Message
