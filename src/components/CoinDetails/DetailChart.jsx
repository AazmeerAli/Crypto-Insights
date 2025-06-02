import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import CryptoListJSON from "./CryptoList.json";
import { CoinContext } from "../../context/CoinContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import LoadingComponent from "../LoadingComponent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const optionsList = [
  { label: "1d", value: "1" },
  { label: "7d", value: "7" },
  { label: "1m", value: "30" },
  { label: "3m", value: "90" },
  { label: "6m", value: "180" },
  { label: "1y", value: "364" },
];

export default function DetailChart({ coin }) {
  const [days, setDays] = useState("30");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [selectedChart, setSelectedChart] = useState("Prices"); // Naya state
  const fetchIdRef = useRef(0);
  const commonBtnClasses = "px-3 py-1 rounded border transition cursor-pointer text-sm font-medium";

  const { error, setError, currency } = useContext(CoinContext)

  useEffect(() => {
    if (!coin?.id) return;
    const myCoin = coin;
    let best = null;
    let matchCount = 0;

    for (const c of CryptoListJSON) {
      let count = 0;
      if (c.id.toLowerCase() === myCoin.id.toLowerCase()) count++;
      if (c.name.toLowerCase() === myCoin.name.toLowerCase()) count++;
      if (c.symbol.toLowerCase() === myCoin.symbol.toLowerCase()) count++;
      if (count > matchCount) {
        matchCount = count;
        best = c;
        if (count === 3) break;
      }
    }
    setCurrentMatch(best);
  }, [coin]);

  useEffect(() => {
    if (!currentMatch?.id) return;
    const fetchId = ++fetchIdRef.current;
    setLoading(true);

    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${currentMatch.id}/market_chart?vs_currency=${currency?.value}&days=${days}`
      )
      .then((res) => {
        if (fetchId !== fetchIdRef.current) return;
        const { prices, market_caps, total_volumes } = res.data;

        const formatted = prices.map(([timestamp], i) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price: prices[i]?.[1].toFixed(2) ?? null,
          marketCap: market_caps[i]?.[1].toFixed(2) ?? null,
          volume: total_volumes[i]?.[1].toFixed(2) ?? null,
        }));

        setChartData(formatted);
        setError(null); // Clear any previous errors
        if (formatted.length === 0) {
          setError("No data available for the selected period.");
        }
      })
      .catch((error) => {
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          let message = "Something went wrong";

          if (status === 401) {
            message = "Unauthorized – API key missing or invalid";
          } else if (status === 429) {
            message = "Too many requests – You are being rate limited";
          } else if (status === 403) {
            message = "Forbidden – You don’t have access";
          } else if (status === 404) {
            message = "Not found – The endpoint doesn't exist";
          } else if (status >= 500) {
            message = "Server error – Please try again later";
          } else if (data?.message) {
            message = data.message; // if API returns a specific message
          }

          setError("Error:", message);
        } else if (error.request) {
          setError("Network Error: Bad or Too many requests");
        } else {
          setError("Error setting up request:", error.message);
        }
      })
      .finally(() => setLoading(false));
  }, [days, currency, currentMatch]);

  // Chart.js ke liye data tayar karna
  const chartJsData = {
    labels: chartData.map((d) => d.time),
    datasets: [
      selectedChart === "Prices" && {
        label: "Prices (" + currency?.label + ")",
        data: chartData.map((d) => Number(d.price)),
        // borderColor: "rgb(75, 192, 192)",
        borderColor: '#c4b5fd',
        backgroundColor: "#c4b5fd",
        tension: 0.1,
        pointRadius: 0,
      },
      selectedChart === "Market Caps" && {
        label: "Market Caps (" + currency?.label + ")",
        data: chartData.map((d) => Number(d.marketCap)),
        // borderColor: "rgb(255, 99, 132)",
        borderColor: '#c4b5fd',
        backgroundColor: "#c4b5fd",
        tension: 0.1,
        pointRadius: 0,
      },
      selectedChart === "Total Volumes" && {
        label: "Total Volumes (" + currency?.label + ")",
        data: chartData.map((d) => Number(d.volume)),
        // borderColor: "rgb(53, 162, 235)",
        borderColor: '#c4b5fd',
        backgroundColor: "#c4b5fd",
        tension: 0.1,
        pointRadius: 0,
      },
    ].filter(Boolean),
  };

  // Chart.js options
  const chartJsOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: selectedChart + " Chart - Last " + days + " days",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "category",
        title: { display: false },
        grid: {
          // color: "#4b5563", 
          display: false,
          drawTicks: true,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          // callback: function (value) {
          //   return new Date(value).toLocaleString();
          // },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "#4b5563",
          drawTicks: true,
          drawBorder: true,
        },
        ticks: {
          callback: function (value) {
            const abs = Math.abs(value);
            if (abs >= 1e21) return value / 1e12 + "S";
            if (abs >= 1e15) return value / 1e12 + "Q";
            if (abs >= 1e12) return value / 1e12 + "T";
            if (abs >= 1e9) return value / 1e9 + "B";
            if (abs >= 1e6) return value / 1e6 + "M";
            if (abs >= 1e3) return value / 1e3 + "K";
            return value;
          },
        },
      },
    },
  };

  if (loading && chartData.length === 0) {
    return (
      <div className="w-full h-70 mx-auto">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center gap-4 ">
      {/* {loading && <p>Loading...</p>} */}
      {chartData.length > 0 && (
        <div className="w-full flex flex-col justify-center" style={{ height: 400 }}>
          <Line
            options={chartJsOptions}
            data={chartJsData}
            height={300}
            width={600}
            style={{ display: 'block', width: '100%', height: '100%' }}
          />
        </div>
      )}

      <div className={`flex h-4 w-full my-2 ${error ? 'text-red-500' : 'text-violet-300'}`}>  
        {loading ? 'Loading Data, please wait...' :
          error ? error : ''}
      </div>
      <div className="w-full flex justify-between">
        <div className="flex gap-1.5 justify-center">
          {["Prices", "Market Caps", "Total Volumes"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setError(null)
                setSelectedChart(type)
              }}
              className={`${commonBtnClasses} ${selectedChart === type ? "bg-violet-300 text-violet-900 border-violet-400" : "bg-transparent border-violet-300 text-violet-300"}`}
              disabled={loading}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {optionsList.map((option) => (
            <button
              key={option.value}
              disabled={loading}
              onClick={() => {
                setError(null)
                option.value !== days && setDays(option.value)
              }}
              className={`${commonBtnClasses} ${days === option.value
                ? "bg-violet-300 text-violet-900"
                : "bg-transparent border border-violet-300 text-violet-300"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
