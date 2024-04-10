import { useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"

import "./index.scss"
import { useDebounce } from "../../../../hooks/useDebounce"

function Search({ initialValue = "", placeholder = "Pesquise...", onChange }) {
  const [search, setSearch] = useState(initialValue)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    onChange(debouncedSearch)
  }, [debouncedSearch, onChange])

  return (
    <div className="search-jobs">
      <input
        aria-label="Pesquisar vagas"
        type="text"
        value={search}
        placeholder={placeholder}
        onChange={({ target }) => setSearch(target.value)}
      />
      <button type="button" aria-label="Pesquisar">
        <SearchIcon size={20} />
      </button>
    </div>
  )
}

export default Search
