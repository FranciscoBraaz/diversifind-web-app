import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

// Components
import Button from "../Button"

// Styles
import "./index.scss"

const visibleStyle = {
  opacity: 1,
  visibility: "visible",
}

const hiddenStyle = {
  opacity: 0,
  visibility: "hidden",
}

function BackToTop() {
  const targetRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    })
  }

  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin around the root
      threshold: 0, // Trigger when 50% of the target is visible
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    // Cleanup observer on component unmount
    return () => observer.disconnect()
  }, []) // Empty dependency array ensures the effect runs once after mount

  function handleBackToTop() {
    const element = document.getElementById("new-post")
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    })
  }

  return (
    <div
      className="back-to-top"
      ref={targetRef}
      style={isVisible ? visibleStyle : hiddenStyle}
    >
      <Button rightIcon={<ArrowUp size={16} />} onClick={handleBackToTop}>
        Voltar ao início
      </Button>
    </div>
  )
}

export default BackToTop
