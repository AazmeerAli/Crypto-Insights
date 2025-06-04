import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext';
import axios from 'axios';
import LoadingComponent from '../LoadingComponent';
import DetailChart from './DetailChart';

async function getExchangeRate(targetCurrency) {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    // console.log(Object.keys(data.rates).length)
    return data.rates[targetCurrency]; 
}


async function convertCryptoDataToCurrency(cryptoDataUSD, targetCurrency) {
    const rate = await getExchangeRate(targetCurrency);

    return {
        price: cryptoDataUSD.quotes.USD.price * rate,
        market_cap: cryptoDataUSD.quotes.USD.market_cap * rate,
        volume_24h: cryptoDataUSD.quotes.USD.volume_24h * rate,
    };
}

function formatNumberWithFixedDecimals(num, decimals = 2) {
 
    if (!isFinite(num)) return num.toString();

   
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(num * factor) / factor;
  
    let str = rounded.toString();

    if (str.includes('e')) {
        str = rounded.toFixed(20).replace(/(\.\d*?)0+$/, '$1');
        if (str.endsWith('.')) str = str.slice(0, -1);
    }

    const parts = str.split('.');

    if (parts.length === 1) {
        return parts[0] + '.' + '0'.repeat(decimals);
    }

    if (parts[1].length < decimals) {
        return parts[0] + '.' + parts[1] + '0'.repeat(decimals - parts[1].length);
    }

    if (parts[1].length > decimals) {
        return parts[0] + '.' + parts[1].substring(0, decimals);
    }

    return str;
}

function formatDecimalSignificant(num, sigFigs = 2) {
    const absNum = Math.abs(num);

    if (absNum >= 1) {
        return formatNumberWithFixedDecimals(num, 2);
    } else {
        if (num === 0) return "0.00";

        const log10 = Math.floor(Math.log10(absNum));
        const factor = Math.pow(10, 2 - log10 - 1);
        const rounded = Math.round(num * factor) / factor;

        let str = rounded.toString();

        if (str.startsWith('.')) str = '0' + str;

        const decimalPlaces = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(rounded))) - 1);
        return Number(str).toFixed(decimalPlaces);
    }
}

const DetailsSection = () => {

    const [convertedData, setConvertedData] = useState(null);
    const { coins, setCoins, allCoins, setAllCoins, currency, loading, setLoading, headerHeight, footerHeight } = useContext(CoinContext);
    const { coin } = useParams()
    const [coinDetail, setCoinDetail] = useState(null);
    const currencySymbol = currency.label.split(' - ')[1] || '$';
    // console.log(coinDetail)

    const fetchCoins = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`https://api.coinpaprika.com/v1/tickers/${coin}`);
            setCoinDetail(res.data);
        } catch (error) {
            console.error('Error fetching coins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoins();
    }, []);


    useEffect(() => {
        if (coinDetail) {
            convertCryptoDataToCurrency(coinDetail, currency.value.toUpperCase())
                .then((value) => setConvertedData(value))
                .catch((error) => console.error('Error converting crypto data:', error));
        }
    }, [currency, coinDetail]);


    const coinData = [
        {
            name: 'Crypto Market Rank',
            data: coinDetail?.rank || 'N/A',
        },
        {
            name: 'Current Price',
            data: convertedData?.price >= 1 ?
                `${currencySymbol} ${((formatDecimalSignificant(Number(convertedData?.price))) / 1).toLocaleString('en-US')}` :
                convertedData?.price < 1 ?
                    `${currencySymbol} ${(formatDecimalSignificant(Number(convertedData?.price))).toLocaleString('en-US')}`
                    : 'N/A',
        },
        {
            name: 'Market Cap',
            data:convertedData?.market_cap >= 1 ?
                `${currencySymbol} ${((formatDecimalSignificant(Number(convertedData?.market_cap))) / 1).toLocaleString('en-US')}` :
                convertedData?.market_cap < 1 ?
                    `${currencySymbol} ${(formatDecimalSignificant(Number(convertedData?.market_cap))).toLocaleString('en-US')}`
                    : 'N/A',
        },
        {
            name: '24H Change',
            data: coinDetail?.quotes.USD.percent_change_24h ? `${coinDetail?.quotes.USD.percent_change_24h}%` : 'N/A',
        },
        {
            name: '24H Volume',
            data:  convertedData?.volume_24h >= 1 ?
                `${currencySymbol} ${((formatDecimalSignificant(Number(convertedData?.volume_24h))) / 1).toLocaleString('en-US')}` :
                convertedData?.volume_24h < 1 ?
                    `${currencySymbol} ${(formatDecimalSignificant(Number(convertedData?.volume_24h))).toLocaleString('en-US')}`
                    : 'N/A',

        },
    ]

    if (loading) return (
        <div
            style={{ height: `calc(100vh - ${footerHeight + headerHeight + 16}px)` }}
            className="flex justify-center items-center h-full"
        >
            <LoadingComponent />
        </div>

    )
    return (
        <div
            className='w-full md:w-[90%] lg:w-[70%] max-w-[1000px] flex flex-col items-center justify-center h-full py-14 xs:py-16 sm:py-18 mx-auto'
            style={{ minHeight: `calc(100vh - ${footerHeight + headerHeight + 16}px)` }}
        >
            <div className='w-18 xs:w-20 sm:w-24'>
                <img
                    src={`https://assets.coincap.io/assets/icons/${coinDetail?.symbol.toLowerCase()}@2x.png`}
                    alt={coinDetail?.name}
                    width={20}
                    height={20}
                    className="text-[0px] w-full"
                />
            </div>
            <h1 className='text-white font-bold text-xl base:text-2xl sm:text-3xl md:text-4xl text-center mt-4'>
                {coinDetail?.name ? `${coinDetail?.name} (${coinDetail?.symbol})` : 'Coin not found'}
            </h1>
            <div
                className='w-full'
            >
                <DetailChart
                    coin={coinDetail}
                />
            </div>
            <div className='w-full border-1 border-gray-600 my-5'></div>
            <div className='w-full'>
                {coinData.map((value, index) => (
                    <div
                        key={index}
                        className='flex justify-between text-white'
                    >
                        <span className='text-violet-300'>{value.name}</span>
                        <span className='text-white'>{value.data}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DetailsSection
