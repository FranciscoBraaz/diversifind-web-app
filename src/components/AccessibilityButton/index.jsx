import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useDarkreader } from "react-darkreader"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Assets
import Accessibility from "../../assets/accessibility.svg?react"

// Components
import Dropdown from "../Dropdown"

// Styles
import "./index.scss"

function AccessibilityButton() {
  const user = parseLocalStorageJson("diversiFindUser-theme")
  const darkModeIsActive = user?.theme === "dark"

  const [isDark, { toggle }] = useDarkreader(darkModeIsActive, {
    contrast: 115,
  })
  const [zoomLevel, setZoomLevel] = useState(100)

  useEffect(() => {
    const newUser = { ...user, theme: isDark ? "dark" : "light" }
    localStorage.setItem("diversiFindUser-theme", JSON.stringify(newUser))
  }, [isDark, user])

  const accessibilityOptions = [
    { label: "Alto contraste", icon: "ContrastIcon", action: toggle },
    {
      label: `Aumentar zoom`,
      icon: "Plus",
      action: () => {
        if (zoomLevel >= 120) return
        document.body.style.zoom = `${zoomLevel + 5}%`
        setZoomLevel(zoomLevel + 5)
      },
    },
    {
      label: `Diminuir zoom`,
      icon: "Minus",
      action: () => {
        if (zoomLevel <= 100) return
        document.body.style.zoom = `${zoomLevel - 5}%`
        setZoomLevel(zoomLevel - 5)
      },
    },
  ]

  return createPortal(
    <Dropdown
      options={accessibilityOptions}
      customClass="accessibility-button"
      buttonLabel="Acessar mais opções de acessibilidade"
      width={220}
      side="top"
      preventClose
    >
      <Accessibility />
    </Dropdown>,
    document.body,
  )
}

export default AccessibilityButton
