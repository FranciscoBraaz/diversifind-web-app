import ReactPaginate from "react-paginate"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Custom hooks
import { useMedia } from "../../hooks/useMedia"

import "./index.scss"

function Pagination({ currentPage = 1, totalPages = 1, onClickAction }) {
  const isMobile = useMedia("(max-width: 960px)")

  return (
    <div className="pagination-container">
      <ReactPaginate
        previousLabel={<ChevronLeft />}
        nextLabel={<ChevronRight />}
        breakLabel={"..."}
        breakClassName={"pagination__break-me"}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={isMobile ? 1 : 5}
        onPageChange={({ selected }) => onClickAction(selected + 1)}
        containerClassName={"pagination"}
        activeClassName={"pagination__active"}
        forcePage={Number(currentPage - 1)}
        disableInitialCallback
      />
    </div>
  )
}

export default Pagination
