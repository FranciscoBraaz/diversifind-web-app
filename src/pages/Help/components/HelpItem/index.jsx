import { forwardRef } from "react"
import { ChevronDownIcon } from "lucide-react"

// Components
import Accordion from "../../../../components/Accordion"

// Styles
import "./index.scss"

const AccordionTrigger = forwardRef(({ triggerText, ...props }, ref) => {
  return (
    <button ref={ref} {...props} className="help-item__accordion-trigger">
      <span>{triggerText}</span>
      <ChevronDownIcon
        className="help-item__accordion-trigger-chevron"
        aria-hidden
      />
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

function AccordionContent({ option }) {
  return (
    <div
      className="help-item__accordion-content"
      dangerouslySetInnerHTML={{ __html: option.content }}
    />
  )
}

function HelpItem({ option }) {
  return (
    <Accordion
      id={option.text}
      trigger={
        <AccordionTrigger triggerText={option.text} path={option.path} />
      }
      content={<AccordionContent option={option} />}
    />
  )
}

export default HelpItem
