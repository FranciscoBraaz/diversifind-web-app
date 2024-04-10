import React from "react"

export function useMedia(media) {
  const [match, setMatch] = React.useState(null)

  React.useEffect(() => {
    function changeMedia() {
      const { matches } = window.matchMedia(media)
      setMatch(matches)
    }
    changeMedia()
    window.addEventListener("resize", changeMedia)
    return () => window.removeEventListener("resize", changeMedia)
  }, [media])

  return match
}
