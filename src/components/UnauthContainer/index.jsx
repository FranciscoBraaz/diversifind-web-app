import { useNavigate } from "react-router-dom"

// Assets
import { HelpCircle } from "lucide-react"
import Logo from "../../assets/logo.svg?react"

// Components
import AccessibilityButton from "../AccessibilityButton"

// Styles
import "./index.scss"

function UnauthContainer({
  children,
  bannerTitle,
  bannerDesc,
  renderIllustration,
}) {
  const navigate = useNavigate()

  return (
    <div className="unauth-container">
      <AccessibilityButton />
      <section className="unauth-container__form-section">
        <div className="logo-container">
          <Logo />
          <span>DiversiFind</span>
        </div>
        <button
          className="unauth-container__help-button"
          aria-label="Ajuda"
          onClick={() => navigate("/ajuda")}
        >
          <span>Ajuda</span>
          <HelpCircle />
        </button>
        <div className="unauth-container__wrapper-children">{children}</div>
      </section>
      <section className="unauth-container__banner-section">
        <div className="unauth-container__banner-section__container-text">
          <h2>{bannerTitle}</h2>
          <p>{bannerDesc}</p>
        </div>
        {renderIllustration()}
      </section>
    </div>
  )
}

export default UnauthContainer
