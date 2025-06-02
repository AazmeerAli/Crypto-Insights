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
    return data.rates[targetCurrency];  // Example: 'PKR' or 'EUR' or 'JPY'
}


async function convertCryptoDataToCurrency(cryptoDataUSD, targetCurrency) {
    const rate = await getExchangeRate(targetCurrency);

    return {
        price: cryptoDataUSD.quotes.USD.price * rate,
        market_cap: cryptoDataUSD.quotes.USD.market_cap * rate,
        volume_24h: cryptoDataUSD.quotes.USD.volume_24h * rate,
    };
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
            // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7`);
            // console.log(response.data)
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


    // console.log(convertedData)
    const coinData = [
        {
            name: 'Crypto Market Rank',
            data: coinDetail?.rank || 'N/A',
        },
        {
            name: 'Current Price',
            data: convertedData?.price
                ? `${currencySymbol} ${Number(convertedData?.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : 'N/A',
        },
        {
            name: 'Market Cap',
            data: convertedData?.market_cap ? `${currencySymbol} ${convertedData?.market_cap.toLocaleString()}` : 'N/A',
        },
        {
            name: '24 Hour Change',
            data: coinDetail?.quotes.USD.percent_change_24h ? `${coinDetail?.quotes.USD.percent_change_24h}%` : 'N/A',
        },
        {
            name: '24 Hour Volume',
            data: convertedData?.volume_24h
                ? `${currencySymbol} ${Number(convertedData?.volume_24h).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : 'N/A',

        },
    ]

    if (loading) return (
        <div
            // 16px ki footer me padding ha
            style={{ height: `calc(100vh - ${footerHeight + headerHeight + 16}px)` }}
            className="flex justify-center items-center h-full"
        >
            <LoadingComponent />
        </div>

    )
    return (
        <div
            className='w-[70%] flex flex-col items-center justify-center h-full py-20 mx-auto'
            // 16px ki footer me padding ha
            style={{ minHeight: `calc(100vh - ${footerHeight + headerHeight + 16}px)` }}
        >
            <div className='w-24'>
                <img
                    src={`https://assets.coincap.io/assets/icons/${coinDetail?.symbol.toLowerCase()}@2x.png`}
                    alt={coinDetail?.name}
                    width={20}
                    height={20}
                    className="text-[0px] w-full"
                />
            </div>
            <h1 className='text-white font-bold text-xl base:text-2xl sm:text-3xl md:text-4xl text-center mt-4'>
                {coinDetail?.name} ({coinDetail?.symbol})
            </h1>
            <div
                className='w-full h-auto'
            >
                <DetailChart
                    coin={coinDetail}
                />
            </div>
            <div className='w-full border-1 border-gray-600 my-5'></div>
            <div className='min-w-xl w-full'>
                {coinData.map((value, index) => (
                    <div
                        key={index}
                        className='flex justify-between text-white'
                    >
                        <span className='text-white'>{value.name}</span>
                        <span className='text-violet-300'>{value.data}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DetailsSection
