import React, { useContext, useEffect, useState } from 'react'
import { CoinContext } from '../../context/CoinContext';
import { supportedCurrencies } from '../../context/currencies';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { usePaginationNumbers } from './Pagination/usePaginationNumbers';
import { usePaginationArrows } from './Pagination/usePaginationArrows';
import Pagination from './Pagination/Pagination';
import LoadingComponent from '../LoadingComponent';
import LoadingTable from '../LoadingTable';
import { useNavigate } from 'react-router-dom';

function formatSmartNumber(input) {
  const num = Number(input);
  if (isNaN(num)) return "NaN";
  if (num === 0) return "0";

  const units = [
    { value: 1e24, symbol: "Sp" },
    { value: 1e21, symbol: "Sx" },
    { value: 1e18, symbol: "Qi" },
    { value: 1e15, symbol: "Q" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" }
  ];

  // Large number formatting
  for (let i = 0; i < units.length; i++) {
    if (num >= units[i].value) {
      return (num / units[i].value).toFixed(1).replace(/\.0$/, "") + units[i].symbol;
    }
  }

  // Small number formatting (less than 0.01)
  if (num < 0.01) {
    const str = num.toString();
    const afterDecimal = str.split(".")[1] || "";
    let i = 0;
    while (afterDecimal[i] === "0") i++;
    const sig = afterDecimal.slice(i, i + 2);
    return "0." + "0".repeat(i) + sig;
  }

  // Default for numbers between 0.01 and 999
  return num.toFixed(2).replace(/\.00$/, "");
}


async function getExchangeRate(targetCurrency) {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await response.json();
  // console.log(Object.keys(data.rates).length)
  return data.rates[targetCurrency];  // Example: 'PKR' or 'EUR' or 'JPY'
}


async function convertCryptoDataToCurrency(cryptoDataUSD, targetCurrency) {
  const rate = await getExchangeRate(targetCurrency);

  return {
    price: cryptoDataUSD.quotes.USD.price * rate,
    market_cap: cryptoDataUSD.quotes.USD.market_cap * rate,
  };
}




const CoinsList = () => {

  const navigate=useNavigate()
  const cellPadding = 'px-4 py-2 2xl:px-5 2xl:py-3';
  const [convertedData, setConvertedData] = useState([]);
  const { paginatedCoins, totalPages, totalCoins, setTotalCoins, currentPage, setCurrentPage, allCoins, setAllCoins, allCurrencies, currency, setCurrency, loading, setLoading, error, setError } = useContext(CoinContext);
  const currencySymbol = currency.label.split(' - ')[1] || '$';
  const paginationButtonStyles = 'w-9 h-9 flex justify-center items-center border-1 border-gray-400 rounded-full cusror-pointer transition-colors duration-200 hover:bg-gray-500 hover:text-white ';
  // const totalPages = Math.ceil(totalCoins / 10);

  useEffect(() => {
    Promise.all(paginatedCoins.map(value =>
      convertCryptoDataToCurrency(value, currency.value.toUpperCase())
    )).then(results => setConvertedData(results));
  }, [paginatedCoins, currency]);

  return (
    <div className='w-full md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[1100px] overflow-x-auto flex justify-center mt-10 mb-16 mx-auto rounded-md'>
      <div className="min-w-full inline-block align-middle rounded-md ">
        <table
          className={`table-auto w-full  text-white border-collapse-separate bg-indigo-900 rounded-md py-2`}
          style={{ borderSpacing: '0 10px' }} // vertical spacing 10px, horizontal 0
        >
          <thead className="border-b-1 border-gray-500">
            <tr className="text-left">
              <th className={`${cellPadding} text-nowrap font-normal`}>#</th>
              <th className={`${cellPadding} text-nowrap font-normal`}>Coin</th>
              <th className={`${cellPadding} text-nowrap font-normal`}>Price</th>
              <th className={`${cellPadding} text-nowrap font-normal text-center `}>24H Change</th>
              <th className={`${cellPadding} text-nowrap font-normal text-right `}>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className=''>
                <td colSpan="5" className="py-16 text-center" style={{ width: '100%' }}>
                  <LoadingTable />
                </td>
              </tr>
            ) :
              paginatedCoins.map((value, index) => {
                const convertedValues = convertedData[index];
                return (
                  <tr
                    key={value.rank}
                    className="text-gray-400 text-nowrap border-b-1 border-gray-500 bg-indigo-900 rounded-md"
                    style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
                    onClick={()=>navigate(`/${value.id.toLowerCase()}`)}
                  >
                    <td className={`${cellPadding}`}>{value.rank}</td>
                    <td className={`${cellPadding} flex gap-2 items-center`}>
                      <img
                        src={`https://assets.coincap.io/assets/icons/${value.symbol.toLowerCase()}@2x.png`}
                        alt={value.name}
                        width={20}
                        className="text-[0px]"
                      />

                      {value.name} - {value.symbol}
                    </td>
                    <td className={`${cellPadding}`}>
                      {convertedValues
                        ? `${currencySymbol} ${formatSmartNumber(convertedValues.price)}`
                        : 'Loading...'}
                    </td>
                    <td
                      className={`${cellPadding} text-center ${value.quotes.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {value.quotes.USD.percent_change_24h
                        ? `${Number(value.quotes.USD.percent_change_24h.toFixed(2))}%`
                        : 'N/A'}
                    </td>
                    <td className={`${cellPadding} text-right`}>
                      {convertedValues
                        ? `${currencySymbol} ${formatSmartNumber(convertedValues.market_cap)}`
                        : 'Loading...'}
                    </td>
                  </tr>
                );
              })}
          </tbody>
          <tfoot className='border-t-1 border-gray-500'>
            <tr>
              <td colSpan="100%">
                <Pagination />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default CoinsList
