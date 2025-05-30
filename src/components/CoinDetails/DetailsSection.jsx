import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext';
import axios from 'axios';
import LoadingComponent from '../LoadingComponent';

const DetailsSection = () => {

    const { coins, setCoins, allCoins, setAllCoins, loading, setLoading, headerHeight, footerHeight } = useContext(CoinContext);
    const { coin } = useParams()
    const [coinDetail, setCoinDetail] = useState(null);
    console.log(coinDetail)

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

    const coinData = [
        {
            name: 'Crypto Market Rank',
            data: coinDetail?.rank || 'N/A',
        },
        {
            name: 'Current Price',
            data: coinDetail?.quotes.USD.price
                ? Number(coinDetail.quotes.USD.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : 'N/A',

        },
        {
            name: 'Market Cap',
            data: coinDetail?.quotes.USD.market_cap.toLocaleString() || 'N/A',
        },
        {
            name: '24 Hour Change',
            data: `${coinDetail?.quotes.USD.percent_change_24h}%` || 'N/A',
        },
        {
            name: '24 Hour Volume',
            data: coinDetail?.quotes.USD.volume_24h
                ? Number(coinDetail.quotes.USD.volume_24h).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
            className='flex flex-col items-center justify-center h-full w-full'
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
            <div className='min-w-xl'>
                {coinData.map((value, index) => (
                    <div
                        key={index}
                        className='flex justify-between text-white'
                    >
                        <span>{value.name}</span>
                        <span>{value.data}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DetailsSection
