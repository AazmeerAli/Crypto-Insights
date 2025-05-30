import { useContext } from "react";
import { CoinContext } from "../../../context/CoinContext";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { paginationButtonStyles } from "./Pagination";


export const usePaginationArrows = () => {
    const {
        totalPages,
        currentPage,
        setCurrentPage,
    } = useContext(CoinContext);

    return [
        {
            className: paginationButtonStyles,
            style: {
                cursor: 'pointer',
            },
            onClick: () => {
                setCurrentPage(1);
            },
            icon: <FaAngleDoubleLeft />,
        },
        {
            className: paginationButtonStyles,
            style: {
                cursor: 'pointer',
            },
            onClick: () => {
                if (currentPage === 1) {
                    setCurrentPage(totalPages);
                }
                else {
                    setCurrentPage(currentPage - 1);
                }
            },
            icon: <FaAngleLeft />,
        },
        {
            className: paginationButtonStyles,
            style: {
                cursor: 'pointer',
            },
            onClick: () => {
                if (currentPage === totalPages) {
                    setCurrentPage(1);
                }
                else {
                    setCurrentPage(currentPage + 1);
                }
            },
            icon: <FaAngleRight />,
        },
        {
            className: paginationButtonStyles,
            style: {
                cursor: 'pointer',
            },
            onClick: () => {
                setCurrentPage(totalPages);
            },
            icon: <FaAngleDoubleRight />,
        },
    ]
}