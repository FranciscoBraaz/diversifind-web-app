//Components
import CustomIcon from "../../../../components/CustomIcon"

// Styles
import "./index.scss"

function SectionHeader({ title, icon = "Plus", canEdit, buttonAction }) {
  return (
    <header className="section-header">
      <h2>{title}</h2>
      {canEdit && (
        <button
          className="profile__action-button-section"
          aria-label={`${icon === "Plus" ? "Adicionar" : "Editar"} ${title}`}
          style={{ position: "relative", marginRight: 0, marginTop: 0 }}
          onClick={buttonAction}
        >
          <CustomIcon icon={icon} />
        </button>
      )}
    </header>
  )
}

export default SectionHeader
