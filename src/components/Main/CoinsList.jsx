import React, { useContext, useEffect, useState } from 'react'
import { CoinContext } from '../../context/CoinContext';
import { supportedCurrencies } from '../../context/currencies';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { usePaginationNumbers } from './Pagination/usePaginationNumbers';
import { usePaginationArrows } from './Pagination/usePaginationArrows';
import Pagination from './Pagination/Pagination';

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
    priceUsd: cryptoDataUSD.priceUsd * rate,
    marketCapUsd: cryptoDataUSD.marketCapUsd * rate,
  };
}



const CoinsList = () => {

  const [convertedData, setConvertedData] = useState([]);
  const { totalPages, totalCoins, setTotalCoins, currentPage, setCurrentPage, allCoins, setAllCoins, allCurrencies, currency, setCurrency } = useContext(CoinContext);
  const currencySymbol = currency.label.split(' - ')[1] || '$';
  const paginationButtonStyles = 'w-9 h-9 flex justify-center items-center border-1 border-gray-400 rounded-full cusror-pointer transition-colors duration-200 hover:bg-gray-500 hover:text-white ';
  // const totalPages = Math.ceil(totalCoins / 10);

  useEffect(() => {
    Promise.all(allCoins.map(value =>
      convertCryptoDataToCurrency(value, currency.value.toUpperCase())
    )).then(results => setConvertedData(results));
  }, [allCoins, currency]);

  return (
    <div className='w-full flex justify-center my-10'>
      <table
        className="w-[70%] text-white border-collapse-separate bg-indigo-900 rounded-md py-2"
        style={{ borderSpacing: '0 10px' }} // vertical spacing 10px, horizontal 0
      >
        <thead className="border-b-2 border-gray-600">
          <tr className="text-left">
            <th className="font-normal px-4 py-2">#</th>
            <th className="font-normal px-4 py-2">Coin</th>
            <th className="font-normal px-4 py-2">Price</th>
            <th className="font-normal text-center px-4 py-2">24H Change</th>
            <th className="font-normal text-right px-4 py-2">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {allCoins.map((value, index) => {
            const convertedValues = convertedData[index];

            // const matchedObj = CryptoJSON.find(obj => obj.name === value.name);
            // if (matchedObj) {
            // // var cryptoImage = matchedObj.icon;
            // var cryptoImage = `https://assets.coincap.io/assets/icons/${value.symbol.toLowerCase()}@2x.png`;
            // }
            // console.log(cryptoImage)
            return (
              <tr
                key={value.rank}
                className="text-gray-400 border-b-2 border-gray-600 bg-indigo-900 rounded-md"
                style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
              >
                <td className="px-4 py-2">{value.rank}</td>
                <td className="flex gap-2 items-center px-4 py-2">
                  <img
                    src={`https://assets.coincap.io/assets/icons/${value.symbol.toLowerCase()}@2x.png`}
                    alt={value.name}
                    width={20}
                    className="text-[0px]"
                  />
                  {value.name} - {value.symbol}
                </td>
                <td className="px-4 py-2">
                  {convertedValues
                    ? `${currencySymbol} ${formatSmartNumber(convertedValues.priceUsd)}`
                    : 'Loading...'}
                </td>
                <td className="text-center text-red-500 px-4 py-2">
                  {value.changePercent24Hr
                    ? `${Number(value.changePercent24Hr).toFixed(2)}%`
                    : 'N/A'}
                </td>
                <td className="text-right px-4 py-2">
                  {convertedValues
                    ? `${currencySymbol} ${formatSmartNumber(convertedValues.marketCapUsd)}`
                    : 'Loading...'}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="100%">
              <Pagination/>
            </td>
          </tr>
        </tfoot>
      </table>

    </div>
  )
}

export default CoinsList
