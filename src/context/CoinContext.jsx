import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { supportedCurrencies } from "./currencies";

export const CoinContext = createContext();

const apiKey = import.meta.env.VITE_API_KEY;

const CoinProvider = (props) => {
    const [totalCoins, setTotalCoins] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [allCoins, setAllCoins] = useState([]);
    const [allCurrencies, setAllCurrencies] = useState(supportedCurrencies);
    const [currency, setCurrency] = useState({
        value: "usd",
        label: "USD - $",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const limit = 10
    const offset = (currentPage - 1) * limit;
    const totalPages = Math.ceil(totalCoins / 10);

    const fetchData = async () => {
        try {
            const res = await axios.get(`https://rest.coincap.io/v3/assets`, {
                params: {
                    limit: limit,
                    offset: offset,
                    apiKey: apiKey,
                }
            });
            setAllCoins(res.data.data);
            // const totalCount = res.data.data.length > 0 ? 
            //             parseInt(res.headers['x-total-count']) : 0;
            //                 console.log("Total available coins:", totalCount);

        } catch (err) {
            console.error('Error:', err);
        }
    };

    const fetchTotal = async () => {
        try {
            const res = await axios.get(`https://rest.coincap.io/v3/assets`, {
                params: {
                    limit: 5000,
                    apiKey: apiKey,
                }
            });
            const totalCount = res.data.data.length;
            setTotalCoins(totalCount);
        } catch (err) {
            console.error('Error:', err);
        }
    }

    useEffect(() => {
        fetchTotal();
    }, []);
    
    useEffect(() => {
        fetchData();
    }, [currentPage])
    

    const contextValue = {
        totalCoins,
        setTotalCoins,
        currentPage,
        setCurrentPage,
        totalPages,
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
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
}

export default CoinProvider;