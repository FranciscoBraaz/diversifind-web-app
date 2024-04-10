import * as RadixAvatar from "@radix-ui/react-avatar"

import "./index.scss"
import { Pencil } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

function Avatar({
  src,
  alt = "John Doe",
  canEdit,
  style = { width: 45, height: 45 },
  onEdit,
}) {
  const avatarRef = useRef(null)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    function defineEditButtonPosition() {
      const initialBanner = document.getElementById("initial-banner")
      if (avatarRef.current && initialBanner) {
        const initialBannerPosition = initialBanner.getBoundingClientRect()
        const avatarPosition = avatarRef.current.getBoundingClientRect()

        let top = avatarPosition.top - initialBannerPosition.top
        let left = avatarPosition.left - initialBannerPosition.left

        top = top + avatarPosition.height - 20
        left = left + avatarPosition.width - 20
        setButtonPosition({ top, left })
      }
    }

    defineEditButtonPosition()
    window.addEventListener("resize", defineEditButtonPosition)

    return () => {
      window.removeEventListener("resize", defineEditButtonPosition)
    }
  }, [])

  function getInitials(name) {
    const [firstName, lastName] = name.split(" ")

    if (!lastName) {
      return `${firstName[0]}`
    }

    return `${firstName[0]}${lastName[0]}`
  }

  return (
    <RadixAvatar.Root
      className="avatar"
      ref={avatarRef}
      style={{ ...style, minWidth: style.width, minHeight: style.height }}
    >
      <RadixAvatar.Image className="avatar-image" src={src} alt={alt} />
      <RadixAvatar.Fallback className="avatar-fallback">
        {getInitials(alt)}
      </RadixAvatar.Fallback>
      {canEdit && (
        <button
          className="avatar__edit-button"
          onClick={onEdit}
          aria-label="Edit avatar"
          style={{ ...buttonPosition }}
        >
          <Pencil size={20} />
        </button>
      )}
    </RadixAvatar.Root>
  )
}

export default Avatar
