import React, { useContext, useState } from 'react'
import { CoinContext } from '../../../context/CoinContext';
import { FaSearch } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";

const Search = () => {

    const {
        searchTerm,
        setSearchTerm,
        totalCoinsData,
        setTotalCoinsData,
        allCoins,
        setAllCoins,
        allCurrencies,
        currency,
        setCurrency,
        handleSearch,
    } = useContext(CoinContext);




    return (
        <div className='flex justify-center gap-2'>
            <input
                type='text'
                placeholder='Search Crypto'
                className='w-[200px] base:w-[250px] border-1 hover:border-violet-400 focus:border-violet-400 border-gray-300 rounded outline-none transition-colors duration-200 px-2 py-1 placeholder:text-gray-400 placeholder:opacity-80'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                className='bg-violet-700 hover:bg-violet-800 transition duration-300 px-4 rounded hover:cursor-pointer'
                onClick={handleSearch}
            >
                <IoSearch className="block md:hidden" />
                <span className="hidden md:inline">Search</span>
            </button>
        </div>
    )
}

export default Search
