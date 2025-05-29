import axios from "axios";
import { createContext, useEffect, useState } from "react";
import currencies from './currency-symbols.json';

export const CoinContext = createContext();

const apiKey = import.meta.env.VITE_API_KEY;

const CoinProvider = (props) => {
    const [allCoins, setAllCoins] = useState([]);
    const [allCurrencies, setAllCurrencies] = useState(currencies);
    const [currency, setCurrency] = useState({
        value: "usd",
        label: "USD ($)",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
// console.log(currency)
    const fetchData = async () => {
        try {
            // const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.value}&order=market_cap_desc`, {
            //     // params: { vs_currency: currency.value, per_page: 10 },
            // });
            // // setAllCoins(res.data.data);
            // console.log(res.data.data);

            const res = await axios.get(`https://rest.coincap.io/v3/assets?limit=10&apiKey=${apiKey}`, {
                // params: { vs_currency: currency.value, per_page: 10 },
            });
            setAllCoins(res.data.data);
            // console.log(res.data.data);

        } catch (err) {
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const contextValue = {
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