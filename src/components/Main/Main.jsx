import React from 'react'
import Navbar from './Navbar'
import CoinsList from './CoinsList'
import Intro from './Intro/Intro'
import Footer from './Footer'
import LoadingComponent from '../LoadingComponent'
import { Helmet } from 'react-helmet-async'

const Main = () => {
  return (
    <>
      <Helmet>
        <title>Crypto Insights - Live Market Insights & Coin Stats</title>
        <meta name="description" content="Track live crypto prices, market caps, volumes, and historical charts with Crypto Insights. Real-time data for Bitcoin, Ethereum, and top altcoins." />
        <meta name="keywords" content="crypto insights, live crypto prices, coin stats, cryptocurrency tracker, bitcoin price, ethereum chart, crypto analytics, market cap, volume" />
        <meta name="author" content="Crypto Insights Team" />
        <meta property="og:title" content="Crypto Insights - Live Market Insights & Coin Stats" />
        <meta property="og:description" content="Stay updated with real-time crypto prices, market stats, and historical data. Your complete crypto tracking dashboard." />
        <meta property="og:image" content="https://crypto-tracker-insights.netlify.app/bitcoin.png" />
        <meta property="og:url" content="https://crypto-tracker-insights.netlify.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crypto Insights - Live Market Insights & Coin Stats" />
        <meta name="twitter:description" content="Track real-time prices, charts, market caps, and more for top cryptocurrencies." />
        <meta name="twitter:image" content="https://crypto-tracker-insights.netlify.app/bitcoin.png" />
        <link rel="canonical" href="https://crypto-tracker-insights.netlify.app/" />
      </Helmet>
      <div className='h-full min-h-screen bg-gradient-to-b from-violet-950 via-indigo-950 to-cyan-950 pb-10 px-6 xs:px-8 md:px-10 lg:px-14'>
        <Navbar />
        <Intro />
        <CoinsList />
        <Footer />
      </div>
    </>
  )
}

export default Main
