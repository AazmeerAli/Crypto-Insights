import React, { useContext } from 'react'
import { CoinContext } from './context/CoinContext'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Main from './components/Main/Main'
import CoinDetails from './components/CoinDetails/CoinDetails'
import './App.css'

const App = () => {

  const { allCoins } = useContext(CoinContext)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/:coin-name' element={<CoinDetails />} />
      </Routes>
    </Router>
  )
}

export default App
