import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { supportedCurrencies } from "./currencies";
import apiSupportedCurrencies from "./apiSupportedCurrencies";

export const CoinContext = createContext();

const apiKey = import.meta.env.VITE_API_KEY;

const CoinProvider = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allCoins, setAllCoins] = useState([]);
    const [coins, setCoins] = useState(allCoins);
    const [currentPage, setCurrentPage] = useState(1);
    const apiCurrencies = supportedCurrencies.filter(currency => apiSupportedCurrencies.includes(currency.code.toLowerCase()));
    const [allCurrencies, setAllCurrencies] = useState(apiCurrencies);
    const [currency, setCurrency] = useState({
        value: "usd",
        label: "USD - $",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const limit = 10;
    const offset = (currentPage - 1) * limit;
    const paginatedCoins = coins.slice(offset, offset + limit);
    const totalCoins = coins.length;
    const totalPages = Math.ceil(totalCoins / 10);

    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);

    useEffect(() => {
        const fetchCoins = async () => {
            setLoading(true)
            try {
                const response = await axios.get('https://api.coinpaprika.com/v1/tickers');
                setAllCoins(response.data);
                setCoins(response.data);
            } catch (error) {
                console.error('Error fetching coins:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);


    const handleSearch = () => {
        setCoins(allCoins.filter(coin => coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())));
        setCurrentPage(1);
    }

    const contextValue = {
        currentPage,
        setCurrentPage,
        totalPages,
        coins,
        setCoins,
        allCoins,
        setAllCoins,
        currency,
        setCurrency,
        allCurrencies,
        setAllCurrencies,
        loading,
        setLoading,
        error,
        setError,
        searchTerm,
        setSearchTerm,
        handleSearch,
        paginatedCoins,
        headerHeight,
        setHeaderHeight,
        footerHeight,
        setFooterHeight,
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
}

export default CoinProvider;