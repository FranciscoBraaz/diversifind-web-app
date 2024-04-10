import {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
  Sub,
  SubTrigger,
  SubContent,
} from "@radix-ui/react-dropdown-menu"
import { ChevronRight } from "react-feather"

// Components
import CustomIcon from "../CustomIcon"

// Styles
import "./index.scss"

function Dropdown({
  children,
  options = [],
  width = 200,
  padding = 16,
  sideOffset = 3.5,
  align = "end",
  side = "bottom",
  preventClose = false,
  buttonLabel,
  customClass = "",
}) {
  function returnItemClassName(disabled) {
    let className = "dropdown__content__item"

    if (disabled) className += " dropdown__content__item--disabled"

    return className
  }

  return (
    <Root>
      <Trigger asChild>
        <button
          className={`dropdown__trigger ${customClass}`}
          aria-label={buttonLabel}
        >
          {children}
        </button>
      </Trigger>
      <Portal>
        <Content
          className="dropdown__content"
          align={align}
          side={side}
          sideOffset={sideOffset}
          collisionPadding={{ top: 10, left: 10, right: 10, bottom: 10 }}
          style={{ width, padding, zIndex: 4 }}
        >
          {options.map(
            ({ label, action, icon, disabled, isSub, subOptions }, index) => (
              <div key={index}>
                {isSub && subOptions.length > 0 ? (
                  <Sub>
                    <SubTrigger
                      className={`dropdown__subtrigger ${returnItemClassName(
                        disabled,
                      )}`}
                    >
                      <div>
                        {icon && <CustomIcon size={16} icon={icon} />}{" "}
                        <p>{label}</p>
                      </div>
                      <ChevronRight size={16} />
                    </SubTrigger>
                    <Portal>
                      <SubContent
                        className="dropdown__content"
                        sideOffset={sideOffset}
                        collisionPadding={{ top: 10, left: 10 }}
                        style={{ width, padding }}
                      >
                        {subOptions.map((subOption, subOptionIndex) => (
                          <Item
                            key={subOptionIndex}
                            onClick={subOption.action}
                            className={returnItemClassName(disabled)}
                          >
                            {subOption.icon && (
                              <CustomIcon size={16} icon={subOption.icon} />
                            )}{" "}
                            <p>{subOption.label}</p>
                          </Item>
                        ))}
                      </SubContent>
                    </Portal>
                  </Sub>
                ) : (
                  <Item
                    key={index}
                    onClick={action}
                    onSelect={
                      preventClose
                        ? (event) => event.preventDefault()
                        : undefined
                    }
                    className={returnItemClassName(disabled)}
                  >
                    {icon && <CustomIcon size={16} icon={icon} />}{" "}
                    <p>{label}</p>
                  </Item>
                )}
              </div>
            ),
          )}
        </Content>
      </Portal>
    </Root>
  )
}

export default Dropdown
