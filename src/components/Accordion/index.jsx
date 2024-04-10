import * as AccordionRadix from "@radix-ui/react-accordion"

// Styles
import "./index.scss"

function Accordion({ id, accordionIsActive, trigger, content }) {
  return (
    <AccordionRadix.Root
      className="accordion"
      type="single"
      collapsible
      defaultValue={accordionIsActive ? id : ""}
    >
      <AccordionRadix.Item className="accordion__item" value={id}>
        <AccordionRadix.Header>
          <AccordionRadix.Trigger asChild>{trigger}</AccordionRadix.Trigger>
        </AccordionRadix.Header>
        <AccordionRadix.Content className="accordion-content">
          {content}
        </AccordionRadix.Content>
      </AccordionRadix.Item>
    </AccordionRadix.Root>
  )
}

export default Accordion
