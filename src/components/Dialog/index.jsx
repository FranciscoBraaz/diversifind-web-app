import { Root, Trigger, Portal, Overlay, Content } from "@radix-ui/react-dialog"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

// Styles
import "./index.scss"

function Dialog({
  trigger,
  open,
  header,
  content,
  position = { top: 0, right: 0 },
  contentStyle = {
    maxWidth: 280,
    maxHeight: "90vh",
  },
  overlayColor = "transparent",
  dataSide = "right",
  ariaLabelReference,
}) {
  const widthSmallerThanMaxWidth = useMedia(
    `(max-width: ${contentStyle.maxWidth}px)`,
  )
  const isMobile = useMedia("(max-width: 1220px)")

  function returnContentClassName() {
    let className = "dialog-content"

    switch (dataSide) {
      case "left":
        className += " dialog-content--left"
        break
      case "right":
        className += " dialog-content--right"
        break
      case "top":
        className += " dialog-content--top"
        break
      case "bottom":
        className += " dialog-content--bottom"
        break
      case "center":
        className += " dialog-content--center"
        break
      default:
        break
    }

    return className
  }

  return (
    <Root open={open} modal={!isMobile}>
      {trigger && <Trigger asChild>{trigger}</Trigger>}
      <Portal>
        <Overlay
          className="dialog-overlay"
          style={{ backgroundColor: overlayColor }}
        />
        <Content
          className={returnContentClassName()}
          aria-labelledby={ariaLabelReference}
          aria-describedby={ariaLabelReference}
          style={{
            width: "100%",
            height: "100%",
            ...position,
            ...contentStyle,
            maxWidth: widthSmallerThanMaxWidth ? "90vw" : contentStyle.maxWidth,
          }}
        >
          {header}
          {content}
        </Content>
      </Portal>
    </Root>
  )
}

export default Dialog
