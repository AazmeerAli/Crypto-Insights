import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { supportedCurrencies } from "./currencies";

export const CoinContext = createContext();

const apiKey = import.meta.env.VITE_API_KEY;

const CoinProvider = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    // const [totalCoins, setTotalCoins] = useState(0);
    const [allCoins, setAllCoins] = useState([]);
    const [coins, setCoins] = useState(allCoins);
    const [currentPage, setCurrentPage] = useState(1);
    const [allCurrencies, setAllCurrencies] = useState(supportedCurrencies);
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

    // const fetchData = async () => {
    //     try {
    //         // const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,dogecoin`, {
    //         //     params: {
    //         //         limit: limit,
    //         //         // offset: offset,
    //         //         apiKey: apiKey,
    //         //     }
    //         // });
    //         const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    //             params: {
    //                 vs_currency: 'usd',  // currency yahan change kar sakte hain
    //                 // ids: 'bitcoin,ethereum,dogecoin',
    //                 limit: 5000,
    //             }
    //         })
    //         // setCoins(res.data);c
    //         console.log(res.data)
    //         // const totalCount = res.data.data.length > 0 ? 
    //         //             parseInt(res.headers['x-total-count']) : 0;
    //         //                 console.log("Total available coins:", totalCount);

    //     } catch (err) {
    //         console.error('Error:', err);
    //     }
    // };

    // const fetchTotal = async () => {
    //     try {
    //         const res = await axios.get(`https://rest.coincap.io/v3/assets`, {
    //             params: {
    //                 limit: 5000,
    //                 apiKey: apiKey,
    //             }
    //         });
    //         const data = res.data.data;
    //         setAllCoins(data);
    //         setCoins(prev =>
    //             [...prev, ...data.filter(coin => !prev.some(c => c.id === coin.id))]
    //         );
    //         // const totalCount = res.data.data.length;
    //         // setTotalCoins(totalCount);
    //     } catch (err) {
    //         console.error('Error:', err);
    //     }
    // }

    useEffect(() => {
        const fetchCoins = async () => {
            setLoading(true)
            try {
                const response = await axios.get('https://api.coinpaprika.com/v1/tickers');
                // response.data me pure coins ka array aata hai
                // Filter karo active coins hi show karne ke liye
                const activeCoins = response.data.filter(coin => coin.is_active);
                // setCoins(activeCoins.slice(0, 200)); // pehle 200 coins show kar rahe hain
                // console.log(response.data);
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


    useEffect(() => {
        // fetchData();
        // fetchTotal();
    }, []);

    // useEffect(() => {
    //     fetchData();
    // }, [currentPage])

    const handleSearch = () => {
        setCoins(allCoins.filter(coin => coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())));
        // setSearchTerm('');
        setCurrentPage(1);
    }

    // console.log("all Coins:", allCoins);
    // console.log("Coins:", coins);

    // console.log(searchTerm)

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