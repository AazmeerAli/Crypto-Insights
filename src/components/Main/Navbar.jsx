import React, { useContext, useEffect } from 'react'
import { CoinContext } from '../../context/CoinContext'
import axios from 'axios'
import CurrencyDropdown from './CurrencyDropdown'
import { FaBitcoin } from 'react-icons/fa'

const Navbar = () => {

  const { currency, setCurrency, allCurrencies, setAllCurrencies } = useContext(CoinContext)

  // console.log(allCurrencies)


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
      className='border-1 border-b-gray-600 flex gap-4 py-3 justify-around items-center'
    >
      <div
        className='text-white font-semibold text-2xl flex items-center gap-2'
      >
        <FaBitcoin/>
        AA Crypto
      </div>
      {/* <div>
        <input type='text' list="currencies" name="currencies" id="currencies" />
        <datalist id="currencies">
          {allCurrencies.map((currency, index) => (
            <option value={currency.abbreviation.toLowerCase()}>{currency.abbreviation}</option>
          ))}
        </datalist>
      </div> */}
      <CurrencyDropdown/>
    </header>
  )
}

export default Navbar
