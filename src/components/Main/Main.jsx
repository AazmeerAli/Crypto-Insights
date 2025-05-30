import React from 'react'
import Navbar from './Navbar'
import CoinsList from './CoinsList'
import Intro from './Intro/Intro'
import Footer from './Footer'
import LoadingComponent from '../LoadingComponent'

const Main = () => {
  return (
    <div className='h-full min-h-screen bg-gradient-to-b from-violet-950 via-indigo-950 to-cyan-950 pb-10 px-6 xs:px-8 md:px-10 lg:px-14'>
      <Navbar />
      <Intro />
      <CoinsList />
      <Footer />
    </div>
  )
}

export default Main
