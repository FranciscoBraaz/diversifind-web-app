import { CornerLeftUp } from "lucide-react"
import { useNavigate } from "react-router-dom"

import "./index.scss"

function UnauthHeader({ title, description, hasBackButton, prevRoute }) {
  const navigate = useNavigate()

  return (
    <div className="unauth-header">
      <div>
        {hasBackButton && (
          <button
            className="unauth-header__back-button"
            aria-label="Voltar"
            onClick={() => navigate(prevRoute)}
          >
            <CornerLeftUp size={18} />
          </button>
        )}
        <h1>{title}</h1>
      </div>
      <p>{description}</p>
    </div>
  )
}

export default UnauthHeader
