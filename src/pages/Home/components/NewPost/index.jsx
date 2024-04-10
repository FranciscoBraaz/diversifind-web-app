// Components
import { useState } from "react"
import Avatar from "../../../../components/Avatar"
import PostForm from "../../../../components/PostForm"

// Styles
import "./index.scss"

function NewPost({ user }) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <div className="new-post" id="new-post">
      <Avatar src={user.avatar} alt={user.name} />
      <PostForm
        modalIsOpen={modalIsOpen}
        withTrigger
        setModalIsOpen={setModalIsOpen}
      />
    </div>
  )
}

export default NewPost
