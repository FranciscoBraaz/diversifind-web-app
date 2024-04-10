import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, Settings, HelpCircle } from "lucide-react"
import { toast } from "react-toastify"

// Assets
import Logo from "../../assets/logo.svg?react"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

// Services
import { singOut } from "../../services/authServices"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Components
import Avatar from "../Avatar"
import Dropdown from "../Dropdown"
import MenuMobile from "../MenuMobile"
import AccessibilityButton from "../AccessibilityButton"

// Styles
import "./index.scss"

function Header() {
  const user = parseLocalStorageJson("diversiFindUser")
  const isTablet = useMedia("(max-width: 1220px)")
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const navigate = useNavigate()

  const dropdownOptions = [
    { label: "Perfil", action: () => navigate(`/perfil/${user._id}`) },
    { label: "Sair", action: handleLogout },
  ]

  async function handleLogout() {
    try {
      singOut()
      localStorage.removeItem("diversiFindUser")
      window.location.href = "/login"
    } catch (error) {
      toast.error("Erro interno do servidor")
    }
  }

  const handleClose = useCallback(() => {
    setMenuIsOpen(false)
  }, [])

  return (
    <header className="header">
      <div className="header-container">
        <div className="header__logo-container">
          <Logo />
          <span>DiversiFind</span>
        </div>
        <div className="header__user-info">
          <div className="header__user-info__actions">
            <AccessibilityButton />

            {isTablet && (
              <button
                className="menu-button"
                aria-label="Menu"
                onClick={() => setMenuIsOpen(true)}
              >
                <Menu size={24} />
              </button>
            )}
            {menuIsOpen && (
              <MenuMobile open={menuIsOpen} onClose={handleClose} />
            )}
            <button
              className="header__help-button"
              aria-label="Ajuda"
              onClick={() => navigate("/ajuda")}
            >
              <HelpCircle />
            </button>
            <button
              className="header__settings-button"
              aria-label="Configurações"
              onClick={() => navigate("/configuracoes")}
            >
              <Settings />
            </button>
          </div>
          <Dropdown options={dropdownOptions} width={120}>
            <Avatar src={user?.avatar} alt={user?.name} />
            <div className="header__user-info__text">
              <span>Olá, {user?.name?.split(" ")[0]}</span>
              <span>Bom dia!</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default Header
