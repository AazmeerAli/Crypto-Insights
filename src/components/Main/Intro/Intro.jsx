import React, { useContext, useState } from 'react'
import { CoinContext } from '../../../context/CoinContext';
import Search from './Search';

const Intro = () => {

    return (
        <div className='w-full text-white flex flex-col justify-center my-10 gap-8'>
            <h1 className='font-bold flex flex-col items-center gap-3 text-5xl '>
                Largest
                <span>Crypto Marketplace</span>
            </h1>
            <p className='text-center text-gray-300'>
                Empowering analysts with comprehensive cryptocurrency metrics.
            </p>
            <Search />
        </div>
    )
}

export default Intro
