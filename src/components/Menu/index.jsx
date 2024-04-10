import { forwardRef, memo, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  ChevronDownIcon,
  HelpCircle,
  Home,
  MessageSquare,
  UserRound,
  UserSearch,
  Users,
} from "lucide-react"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Components
import Accordion from "../Accordion"

// Styles
import "./index.scss"

const AccordionTrigger = forwardRef(({ option, path, ...props }, ref) => {
  function returnClassName() {
    let className = "menu__accordion-trigger"
    const currentPathname = window.location.pathname.split("/")[2]

    if (currentPathname && currentPathname === option.path.split("/")[2]) {
      className += " menu__accordion-trigger--active"
    }

    if (window.location.pathname.includes(path)) {
      className += " menu__accordion-trigger--active"
    }

    return className
  }

  return (
    <button ref={ref} {...props} className={returnClassName()}>
      <div>
        {option.icon}
        <span>{option.text}</span>
      </div>
      <ChevronDownIcon className="menu__accordion-chevron" aria-hidden />
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

function AccordionContent({ option, returnOptionClassName, handleNavigateTo }) {
  return (
    <ul className="menu__list-options__sub-menu">
      {option.subMenus.map((subMenu) => (
        <li
          key={subMenu.text}
          className={returnOptionClassName(subMenu.path, true)}
        >
          <button onClick={() => handleNavigateTo(subMenu.path)}>
            {subMenu.text}
          </button>
        </li>
      ))}
    </ul>
  )
}

const MenuComponent = memo(({ isMobile = false, onClose }) => {
  const navigate = useNavigate()
  const user = parseLocalStorageJson("diversiFindUser")
  const [menuMaxHeight, setMenuMaxHeight] = useState(0)

  const menuOptions = [
    {
      icon: <Home />,
      text: "Home",
      path: "/",
    },
    {
      icon: <Briefcase />,
      text: "Vagas",
      path: "/vagas",
      subMenus: [
        {
          text: "Todas as vagas",
          path: "/vagas/todas-vagas",
        },
        {
          text: "Minhas vagas",
          path: "/vagas/minhas-vagas",
        },
        {
          text: "Minhas aplicações",
          path: "/vagas/minhas-aplicacoes",
        },
        {
          text: "Criar vaga",
          path: "/vagas/criar-vaga",
        },
      ],
    },
    {
      icon: <UserRound />,
      text: "Perfil",
      path: `/perfil/${user._id}`,
    },
    {
      icon: <UserSearch />,
      text: "Conexões",
      path: "/conexoes",
    },
    {
      icon: <MessageSquare />,
      text: "Mensagens",
      path: "/mensagens",
    },
    {
      icon: <Users />,
      text: "Comunidades",
      path: "/comunidades",
      subMenus: [
        {
          text: "Todas as comunidades",
          path: "/comunidades/todas-comunidades",
        },
        {
          text: "Minhas comunidades",
          path: "/comunidades/minhas-comunidades",
        },
      ],
    },
    {
      icon: <HelpCircle />,
      text: "Ajuda",
      path: "/ajuda",
    },
  ]

  const menuRef = useRef(null)

  useEffect(() => {
    window.addEventListener("resize", defineMenuMaxHeight)

    defineMenuMaxHeight()
    return () => {
      window.removeEventListener("resize", defineMenuMaxHeight)
    }
  }, [])

  function defineMenuMaxHeight() {
    const menu = menuRef?.current

    if (menu) {
      const { height, top } = menu.getBoundingClientRect()
      const newMenuMaxHeight = window.innerHeight - top - 24

      if (newMenuMaxHeight !== height) {
        setMenuMaxHeight(newMenuMaxHeight)
      }
    }
  }

  function returnOptionClassName(optionPath, isSubMenu = false) {
    let className = isSubMenu
      ? "menu__list-options__sub-menu__option"
      : "menu__list-options__option"

    if (isSubMenu) {
      const currentPathname = window.location.pathname.split("/")[2]
      const currentPathSplitted = optionPath.split("/")[2]

      if (currentPathname === currentPathSplitted) {
        className += " menu__list-options__sub-menu__option--active"
      }
    } else {
      const currentPathname = window.location.pathname.split("/")[1]
      if (optionPath === "/" && !currentPathname) {
        className += " menu__list-options__option--active"
      }

      if (currentPathname === optionPath.split("/")[1] && !isSubMenu) {
        className += " menu__list-options__option--active"
      }
    }

    return className
  }

  function handleNavigateTo(path) {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

  function accordionIsActive(subMenus, optionPath) {
    let isActive = subMenus.some((subMenu) => {
      const currentPathname = window.location.pathname.split("/")[2]

      return (
        currentPathname === subMenu.path.split("/")[2] ||
        window.location.pathname.includes(optionPath)
      )
    })

    return isActive
  }

  function returnMenuClassName() {
    let className = "menu"

    if (isMobile) {
      className += " menu--mobile"
    }

    return className
  }

  return (
    <nav
      className={returnMenuClassName()}
      ref={menuRef}
      style={{ maxHeight: menuMaxHeight > 0 ? menuMaxHeight : "fit-content" }}
    >
      <ul className="menu__list-options">
        {menuOptions.map((option) => (
          <li key={option.text} className={returnOptionClassName(option.path)}>
            {option.subMenus && (
              <Accordion
                id={option.text}
                accordionIsActive={accordionIsActive(
                  option.subMenus,
                  option.path,
                )}
                trigger={
                  <AccordionTrigger option={option} path={option.path} />
                }
                content={
                  <AccordionContent
                    option={option}
                    returnOptionClassName={returnOptionClassName}
                    handleNavigateTo={handleNavigateTo}
                  />
                }
              />
            )}
            {!option.subMenus && (
              <button onClick={() => handleNavigateTo(option.path)}>
                {option.icon}
                <span>{option.text}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
})
MenuComponent.displayName = "Menu"

export default MenuComponent
