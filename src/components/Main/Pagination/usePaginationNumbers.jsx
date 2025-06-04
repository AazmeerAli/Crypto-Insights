import { useContext } from "react";
import { CoinContext } from "../../../context/CoinContext";
import { paginationButtonStyles } from "./Pagination";

export const usePaginationNumbers = () => {
  const { totalPages, currentPage, setCurrentPage } = useContext(CoinContext);

  const visiblePages = [];

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 2) {
    end = Math.min(5, totalPages);
  } else if (currentPage >= totalPages - 1) {
    start = Math.max(1, totalPages - 4);
  }

  for (let i = start; i <= end; i++) {
    visiblePages.push({
      className: currentPage === i ? `${paginationButtonStyles} bg-violet-300 text-white` : paginationButtonStyles,
      style: { cursor: 'pointer' },
      onClick: () => setCurrentPage(i),
      data: i,
    });
  }

  return visiblePages;
};
