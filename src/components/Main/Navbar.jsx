import React, { useContext, useEffect, useRef } from 'react'
import { CoinContext } from '../../context/CoinContext'
import axios from 'axios'
import CurrencyDropdown from './CurrencyDropdown'
import { FaBitcoin } from 'react-icons/fa'

const Navbar = () => {

  const { currency, setCurrency, allCurrencies, setAllCurrencies,headerHeight,setHeaderHeight } = useContext(CoinContext)
  const headerRef = useRef();
  // console.log(allCurrencies)

  useEffect(() => {
    const height = headerRef.current.offsetHeight;
    setHeaderHeight(height);
  }, []);


  // const fetchCurrencies = () => {
  //   axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies', {
  //     // headers: {
  //     //   mode: 'no-cors',
  //     // }
  //   })
  //     .then(res => setAllCurrencies(res.data))
  //     .catch(err => console.error(err));
  // }

  // useEffect(() => {
  //   fetchCurrencies();
  // }, []);

  return (
    <header
      ref={headerRef}
      className='max-w-[1200px] w-full flex gap-4 py-3 border-b-1 border-gray-500 justify-between items-center mx-auto xl:px-24 2xl:px-0'
    >
      <div
        className='text-white font-semibold text-2xl flex items-center gap-2'
      >
        <FaBitcoin className='text-3xl' />
        <span className='hidden md:inline'>
          AA Crypto
        </span>
      </div>
      {/* <div>
        <input type='text' list="currencies" name="currencies" id="currencies" />
        <datalist id="currencies">
          {allCurrencies.map((currency, index) => (
            <option value={currency.abbreviation.toLowerCase()}>{currency.abbreviation}</option>
          ))}
        </datalist>
      </div> */}
      <CurrencyDropdown />
    </header>
  )
}

export default Navbar
