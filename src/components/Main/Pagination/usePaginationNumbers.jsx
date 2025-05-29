import { useContext } from "react";
import { CoinContext } from "../../../context/CoinContext";

const paginationButtonStyles = 'w-9 h-9 flex justify-center items-center border-1 border-gray-400 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-500 hover:text-white ';

export const usePaginationNumbers = () => {
  const {
    totalPages,
    currentPage,
    setCurrentPage,
  } = useContext(CoinContext);

  return [
    {
      className: currentPage === 1 ? `${paginationButtonStyles} bg-white text-black` : paginationButtonStyles,
      style: {
        cursor: 'pointer',
      },
      onClick: () => {
        if (currentPage === 1) {
          setCurrentPage(currentPage);
        }
        else if (currentPage === 2) {
          setCurrentPage(currentPage - 1);
        }
        else if (currentPage === totalPages) {
          setCurrentPage(currentPage - 4);
        }
        else if (currentPage === (totalPages - 1)) {
          setCurrentPage(currentPage - 3);
        }
        else {
          setCurrentPage(currentPage - 2);
        }
      },
      data: currentPage === 1 ?
        currentPage :
        currentPage === 2 ?
          currentPage - 1 :
          currentPage === totalPages ?
            currentPage - 4 :
            currentPage === totalPages - 1 ?
              currentPage - 3 :
              currentPage - 2,
    },
    {
      className: currentPage === 2 ? `${paginationButtonStyles} bg-white text-black` : paginationButtonStyles,
      style: {
        cursor: 'pointer',
      },
      onClick: () => {
        if (currentPage === 1) {
          setCurrentPage(currentPage + 1);
        }
        else if (currentPage === 2) {
          setCurrentPage(currentPage);
        }
        else if (currentPage === totalPages) {
          setCurrentPage(currentPage - 3);
        }
        else if (currentPage === (totalPages - 1)) {
          setCurrentPage(currentPage - 2);
        }
        else {
          setCurrentPage(currentPage - 1);
        }
      },
      data: currentPage === 2 ?
        currentPage :
        currentPage === 1 ?
          currentPage + 1 :
          currentPage === totalPages ?
            currentPage - 3 :
            currentPage === totalPages - 1 ?
              currentPage - 2 :
              currentPage - 1,
    },
    {
      className: currentPage > 2 && currentPage !== totalPages - 1 && currentPage !== totalPages
        ? `${paginationButtonStyles} bg-white text-black`
        : paginationButtonStyles,
      style: {
        cursor: 'pointer',
      },
      onClick: () => {
        if (currentPage === 1) {
          setCurrentPage(currentPage + 2);
        }
        else if (currentPage === 2) {
          setCurrentPage(currentPage + 1);
        }
        else if (currentPage === totalPages) {
          setCurrentPage(currentPage - 2);
        }
        else if (currentPage === (totalPages - 1)) {
          setCurrentPage(currentPage - 1);
        }
        else {
          setCurrentPage(currentPage);
        }
      },
      data: currentPage === 1 ?
        currentPage + 2 :
        currentPage === 2 ?
          currentPage + 1 :
          currentPage === totalPages ?
            currentPage - 2 :
            currentPage === totalPages - 1 ?
              currentPage - 1 :
              currentPage,
    },
    {
      className: currentPage === (totalPages - 1) ? `${paginationButtonStyles} bg-white text-black` : paginationButtonStyles,
      style: {
        cursor: 'pointer',
      },
      onClick: () => {
        if (currentPage === 1) {
          setCurrentPage(currentPage + 3);
        }
        else if (currentPage === 2) {
          setCurrentPage(currentPage + 2);
        }
        else if (currentPage === totalPages) {
          setCurrentPage(currentPage - 1);
        }
        else if (currentPage === (totalPages - 1)) {
          setCurrentPage(currentPage);
        }
        else {
          setCurrentPage(currentPage + 1);
        }
      },
      data: currentPage === 1 ?
        currentPage + 3 :
        currentPage === 2 ?
          currentPage + 2 :
          currentPage === totalPages ?
            currentPage - 1 :
            currentPage === totalPages - 1 ?
              currentPage :
              currentPage + 1,
    },
    {
      className: currentPage === totalPages ? `${paginationButtonStyles} bg-white text-black` : paginationButtonStyles,
      style: {
        cursor: 'pointer',
      },
      onClick: () => {
        if (currentPage === 1) {
          setCurrentPage(currentPage + 4);
        }
        else if (currentPage === 2) {
          setCurrentPage(currentPage + 3);
        }
        else if (currentPage === totalPages) {
          setCurrentPage(currentPage);
        }
        else if (currentPage === (totalPages - 1)) {
          setCurrentPage(currentPage + 1);
        }
        else {
          setCurrentPage(currentPage + 2);
        }
      },
      data: currentPage === 1 ?
        currentPage + 4 :
        currentPage === 2 ?
          currentPage + 3 :
          currentPage === totalPages ?
            currentPage :
            currentPage === totalPages - 1 ?
              currentPage + 1 :
              currentPage + 2,
    },
  ];
};
