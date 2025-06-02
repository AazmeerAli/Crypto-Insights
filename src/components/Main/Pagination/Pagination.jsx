import React, { useContext } from 'react'
import { usePaginationArrows } from './usePaginationArrows';
import { usePaginationNumbers } from './usePaginationNumbers';
import { CoinContext } from '../../../context/CoinContext';

export const paginationButtonStyles = 'w-7 h-7 sm:w-8 sm:h-8 flex justify-center items-center border-1 border-violet-300 text-violet-300 rounded-full cursor-pointer transition-colors duration-200 text-sm';

const Pagination = () => {

    const { searchTerm, setSearchTerm } = useContext(CoinContext);
    const paginationArrows = usePaginationArrows();
    const paginationNumbers = usePaginationNumbers();

    return (
        <div className={ `flex justify-center items-center gap-4 py-4`}>
            <div className="flex items-center gap-2">
                {paginationArrows.map((arrow, index) => {
                    if (index < 2) {
                        return (
                            <button
                                key={index}
                                className={arrow.className}
                                style={arrow.style}
                                onClick={arrow.onClick}
                            >
                                {arrow.icon}
                            </button>
                        );
                    }
                })}
            </div>

            <div className="flex items-center gap-2">
                {paginationNumbers.map((value, index) => (
                    <button
                        key={index}
                        className={value.className}
                        style={value.style}
                        onClick={value.onClick}
                    >
                        {
                            value.data
                        }
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                {paginationArrows.map((arrow, index) => {
                    if (index >= paginationArrows.length - 2) {
                        return (
                            <button
                                key={index}
                                className={arrow.className}
                                style={arrow.style}
                                onClick={arrow.onClick}
                            >
                                {arrow.icon}
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    )
}

export default Pagination
