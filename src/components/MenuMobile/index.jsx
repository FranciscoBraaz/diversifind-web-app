import { X } from "lucide-react"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

// Components
import Dialog from "../Dialog"
import Menu from "../Menu"

// Styles
import "./index.scss"
import { useEffect, useState } from "react"

function DialogHeader({ title, onClose }) {
  return (
    <header className="menu-mobile__header">
      <h2>{title}</h2>
      <button onClick={onClose}>
        <X />
      </button>
    </header>
  )
}

function DialogContent({ onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 200)
  }, [])

  if (!isVisible) return null
  return (
    <div className="menu-mobile__content">
      <Menu isMobile onClose={onClose} />
    </div>
  )
}

function MenuMobile({ open, onClose }) {
  const isSizeSm = useMedia("(max-width: 480px)")
  const isSizeMd = useMedia("(max-width: 720px)")

  function returnMenuWidth() {
    if (isSizeSm) return "100%"

    if (isSizeMd) return 300

    return 360
  }

  return (
    <Dialog
      open={open}
      header={<DialogHeader title="Menu" onClose={onClose} />}
      content={<DialogContent onClose={onClose} />}
      position={{ top: "0", left: "0" }}
      dataSide="left"
      // withoutAnimation
      contentStyle={{
        maxWidth: returnMenuWidth(),
        maxHeight: "100vh",
      }}
      overlayColor="rgba(0, 0, 0, 0.4)"
    />
  )
}

export default MenuMobile
