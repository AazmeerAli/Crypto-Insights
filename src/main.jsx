import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CoinProvider from './context/CoinContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CoinProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </CoinProvider>
  </StrictMode>,
)
