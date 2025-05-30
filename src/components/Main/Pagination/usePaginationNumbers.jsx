import { useContext } from "react";
import { CoinContext } from "../../../context/CoinContext";

const paginationButtonStyles = 'w-9 h-9 flex justify-center items-center border border-gray-400 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-500 hover:text-white';


export const usePaginationNumbers = () => {
  const { totalPages, currentPage, setCurrentPage } = useContext(CoinContext);

  const visiblePages = [];

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  // Adjust to always show 5 pages if possible
  if (currentPage <= 2) {
    end = Math.min(5, totalPages);
  } else if (currentPage >= totalPages - 1) {
    start = Math.max(1, totalPages - 4);
  }

  for (let i = start; i <= end; i++) {
    visiblePages.push({
      className: currentPage === i ? `${paginationButtonStyles} bg-white text-black` : paginationButtonStyles,
      style: { cursor: 'pointer' },
      onClick: () => setCurrentPage(i),
      data: i,
    });
  }

  return visiblePages;
};
