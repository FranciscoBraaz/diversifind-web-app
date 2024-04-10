import { useEffect, useState } from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"

// Styles
import "./index.scss"

const Tooltip = ({ content, trigger }) => {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (hover) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [hover])

  return (
    <RadixTooltip.Provider className="tooltip">
      <RadixTooltip.Root open={open} delayDuration={0}>
        <RadixTooltip.Trigger onClick={() => setOpen(true)} asChild>
          <button
            className="tooltip__trigger"
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
          >
            {trigger}
          </button>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            align="end"
            className="tooltip__content"
            sideOffset={5}
            onPointerDownOutside={() => setOpen(false)}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

export default Tooltip
