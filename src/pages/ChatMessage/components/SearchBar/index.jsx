import { Search } from "lucide-react"

// Styles
import "./index.scss"
import { useEffect, useState } from "react"
import { useDebounce } from "../../../../hooks/useDebounce"

function SearchBar({ initialValue, bgColor = "transparent", onChange }) {
  const [value, setValue] = useState(initialValue)
  const debouncedSearch = useDebounce(value, 300)

  useEffect(() => {
    onChange(debouncedSearch)
  }, [debouncedSearch, onChange])

  return (
    <div
      className="coversation-search-bar"
      style={{ backgroundColor: bgColor }}
    >
      <input
        type="text"
        aria-label="Campo para pesquisar conversas"
        placeholder="Buscar conversa"
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      <button type="button" aria-label="Pesquisar">
        <Search size={18} />
      </button>
    </div>
  )
}

export default SearchBar
