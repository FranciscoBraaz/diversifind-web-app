import "./index.scss"

function Chip({
  children,
  color = "#3b3b3b",
  backgroundColor = "transparent",
  borderColor = "#3b3b3b",
  style,
}) {
  return (
    <p
      className="chip"
      title={`Conteúdo: ${children}`}
      style={{ color, backgroundColor, borderColor, ...style }}
    >
      {children}
    </p>
  )
}

export default Chip
