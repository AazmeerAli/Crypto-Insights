import React, { useContext, useState } from 'react'
import { CoinContext } from '../../context/CoinContext';

const Intro = () => {

    const { allCoins, setAllCoins, allCurrencies, currency, setCurrency } = useContext(CoinContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        setAllCoins(allCoins.filter(coin => coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())));
        setSearchTerm('');
    }

    return (
        <div className='w-full text-white flex flex-col justify-center my-10 gap-8'>
            <h1 className='font-bold flex flex-col items-center gap-3 text-5xl '>
                Largest
                <span>Crypto Marketplace</span>
            </h1>
            <p className='text-center text-gray-300'>
                Empowering analysts with comprehensive cryptocurrency metrics.
            </p>
            <div className='flex justify-center gap-2'>
                <input
                    type='text'
                    placeholder='Search Cryptocurrency'
                    className='border-1 hover:border-gray-400 border-gray-300 rounded outline-none transition-colors duration-200 px-2 py-1 placeholder:text-gray-400 placeholder:opacity-80'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className='bg-violet-800 px-4 rounded hover:cursor-pointer'
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
        </div>
    )
}

export default Intro
