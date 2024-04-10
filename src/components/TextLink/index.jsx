import { Link } from "react-router-dom"

import "./index.scss"

function TextLink({ children, link, style }) {
  return (
    <p className="text-link" style={{ ...style }}>
      <Link to={link}>{children}</Link>
    </p>
  )
}

export default TextLink
