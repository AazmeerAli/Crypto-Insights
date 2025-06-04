import React, { useContext, useEffect, useRef } from 'react'
import { CoinContext } from '../../context/CoinContext'
import axios from 'axios'
import CurrencyDropdown from './CurrencyDropdown'
import { FaBitcoin } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { currency, setCurrency, allCurrencies, setAllCurrencies,headerHeight,setHeaderHeight } = useContext(CoinContext)
  const headerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const height = headerRef.current.offsetHeight;
    setHeaderHeight(height);
  }, []);

  return (
    <header
      ref={headerRef}
      className='max-w-[1200px] w-full flex gap-4 py-3 border-b-1 border-gray-500 justify-between items-center mx-auto xl:px-24 2xl:px-0'
    >
      <div
        className='text-white font-semibold text-2xl flex items-center gap-2 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <FaBitcoin className='text-3xl ' />
        <span className='hidden md:inline'>
         Crypto Insights
        </span>
      </div>
      <CurrencyDropdown />
    </header>
  )
}

export default Navbar
