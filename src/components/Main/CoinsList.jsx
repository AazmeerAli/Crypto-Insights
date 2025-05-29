import React, { useContext, useEffect, useState } from 'react'
import { CoinContext } from '../../context/CoinContext';
import CryptoJSON from './cryptos.json'

function formatNumber(num) {
  const units = [
    { value: 1e24, symbol: "Sp" }, // Septillion
    { value: 1e21, symbol: "Sx" }, // Sextillion
    { value: 1e18, symbol: "Qi" }, // Quintillion
    { value: 1e15, symbol: "Q" }, // Quadrillion
    { value: 1e12, symbol: "T" }, // Trillion
    { value: 1e9, symbol: "B" }, // Billion
    { value: 1e6, symbol: "M" }, // Million
    { value: 1e3, symbol: "K" }  // Thousand
  ];

  for (let i = 0; i < units.length; i++) {
    if (num >= units[i].value) {
      return (num / units[i].value).toFixed(1).replace(/\.0$/, "") + units[i].symbol;
    }
  }

  return num.toString();
}

async function getExchangeRate(targetCurrency) {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await response.json();
  return data.rates[targetCurrency];  // Example: 'PKR' or 'EUR' or 'JPY'
}

async function convertCryptoDataToCurrency(cryptoDataUSD, targetCurrency) {
  const rate = await getExchangeRate(targetCurrency);

  return {
    priceUsd: cryptoDataUSD.priceUsd * rate,
    marketCapUsd: cryptoDataUSD.marketCapUsd * rate,
  };
}

// function CryptoIcon({ symbol }) {
//   const lowerSymbol = symbol.toLowerCase();
//   return (
//     <img
//       src={`/crypto-icons/${lowerSymbol}.svg`}
//       alt={symbol}
//       width={24}
//       height={24}
//       onError={e => {
//         e.target.onerror = null;
//         e.target.src = '/crypto-icons/default.svg'; // fallback icon agar icon na mile
//       }}
//     />
//   );
// }



const CoinsList = () => {

  // const [coinPrice, setCoinPrice] = useState(0)
  // const [change24H, setChange24H] = useState(0)
  // const [marketCap, setMarketCap] = useState(0)

  const [convertedData, setConvertedData] = useState([]);
  const { allCoins, setAllCoins, allCurrencies, currency, setCurrency } = useContext(CoinContext);
  const symbolMatch = currency.label.match(/\(([^)]+)\)/);
  const currencySymbol = symbolMatch ? symbolMatch[1] : null;
  console.log(allCoins)
  // useEffect(() => {
  //   convertCryptoDataToCurrency(cryptoUSDData, 'PKR').then(converted => {
  //     console.log(converted);
  //   });
  // }, [currency])


  useEffect(() => {
    Promise.all(allCoins.map(value =>
      convertCryptoDataToCurrency(value, currency.value.toUpperCase())
    )).then(results => setConvertedData(results));
  }, [allCoins, currency]);
  console.log(CryptoJSON)
  return (
    <div className='w-full flex justify-center my-10'>
      <table
        className="w-[60%] text-white border-collapse-separate bg-indigo-900 rounded-md py-2"
        style={{ borderSpacing: '0 10px' }} // vertical spacing 10px, horizontal 0
      >
        <thead className="border-b-2 border-amber-400">
          <tr className="text-left">
            <th className="font-normal px-4 py-2">#</th>
            <th className="font-normal px-4 py-2">Coin</th>
            <th className="font-normal px-4 py-2">Price</th>
            <th className="font-normal px-4 py-2">24H Change</th>
            <th className="font-normal px-4 py-2">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {allCoins.map((value, index) => {
            const convertedValues = convertedData[index];
            const matchedObj = CryptoJSON.find(obj => obj.name === value.name);
            if (matchedObj) {
            var cryptoImage = matchedObj.icon;
            }
            console.log(cryptoImage)
            return (
              <tr
                key={value.rank}
                className="text-gray-400 border-b-2 bg-indigo-800 rounded-md"
                style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
              >
                <td className="px-4 py-2">{value.rank}</td>
                <td className="flex gap-2 items-center px-4 py-2">
                  <img src={cryptoImage} alt="" width={20} />
                  {value.name} - {value.symbol}
                </td>
                <td className="px-4 py-2">
                  {convertedValues
                    ? `${currencySymbol} ${formatNumber(convertedValues.priceUsd.toFixed(2))}`
                    : 'Loading...'}
                </td>
                <td className="text-center text-red-500 px-4 py-2">
                  {value.changePercent24Hr
                    ? `${Number(value.changePercent24Hr).toFixed(2)}%`
                    : 'N/A'}
                </td>
                <td className="text-right px-4 py-2">
                  {convertedValues
                    ? `${currencySymbol} ${formatNumber(convertedValues.marketCapUsd)}`
                    : 'Loading...'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  )
}

export default CoinsList
