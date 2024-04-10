import { Oval } from "react-loader-spinner"
import "./index.scss"

function Button({
  children,
  onClick,
  leftIcon,
  rightIcon,
  type = "button",
  disabled = false,
  isLoading = false,
  styleType = "default",
  form,
  style,
}) {
  function returnClassName() {
    let className = "form-button"

    if (styleType === "contained") className += " form-button--contained"
    if (styleType === "outlined") className += " form-button--outlined"
    if (disabled) className += " form-button--disabled"

    return className
  }

  return (
    <button
      onClick={onClick}
      type={type}
      form={form}
      className={returnClassName()}
      style={{ ...style }}
    >
      {leftIcon && <span className="form-button__left-icon">{leftIcon}</span>}
      {isLoading ? (
        <Oval
          visible={true}
          height="20"
          width="20"
          color="#fff"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : (
        children
      )}
      {rightIcon && (
        <span className="form-button__right-icon">{rightIcon}</span>
      )}
    </button>
  )
}

export default Button
