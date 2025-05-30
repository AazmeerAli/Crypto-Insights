import React from 'react'
import Navbar from './Navbar'
import CoinsList from './CoinsList'
import Intro from './Intro/Intro'

const Main = () => {
  return (
    <div className='h-full min-h-screen bg-gradient-to-b from-violet-950 via-indigo-950 to-cyan-950'>
      <Navbar/>
      <Intro/>
      <CoinsList/>
    </div>
  )
}

export default Main
