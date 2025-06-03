import React, { useContext, useEffect, useRef } from 'react'
import { CoinContext } from '../../context/CoinContext';

const Footer = () => {

    const { currency, setCurrency, allCurrencies, setAllCurrencies, footerHeight, setFooterHeight } = useContext(CoinContext)
    const footerRef = useRef();

    useEffect(() => {
        const height = footerRef.current.offsetHeight;
        setFooterHeight(height);
    }, []);

    return (
        <footer ref={footerRef} className='w-full max-w-[1200px] mx-auto border-t-1 border-gray-500 flex flex-col sm:flex-row max-sm:gap-1.5 text-center sm:text-left justify-between pt-2.5 mb-3 sm:mb-4'>
            <div className='text-gray-400 text-sm sm:mt-2'>
                Copyright © Aazmeer Ali 2025. All Right Reserved.
            </div>
            <div className='text-gray-400 text-sm sm:mt-2'>
                Developed by Aazmeer Ali
            </div>
        </footer>
    )
}

export default Footer
