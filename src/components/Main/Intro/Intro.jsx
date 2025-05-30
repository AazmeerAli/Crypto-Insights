import React, { useContext, useState } from 'react'
import { CoinContext } from '../../../context/CoinContext';
import Search from './Search';

const Intro = () => {

    return (
        <div className='w-full text-white flex flex-col justify-center my-10 gap-8'>
            <h1 className='font-bold flex flex-col items-center text-center gap-1 xs:gap-2 md:gap-3 text-2xl base:text-3xl sm:text-4xl md:text-5xl '>
                Largest
                <span>Crypto Marketplace</span>
            </h1>
            <p className='text-center text-gray-300 text-sm base:text-base 2xl:text-lg'>
                Empowering analysts with comprehensive cryptocurrency metrics.
            </p>
            <Search />
        </div>
    )
}

export default Intro
