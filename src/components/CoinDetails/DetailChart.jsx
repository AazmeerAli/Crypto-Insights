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
  { label: "1y", value: "365" },
];


function formatCryptoNumber(value) {
  const abs = Math.abs(value);
  if (abs >= 1e21) return +(value / 1e21).toFixed(2) + 'S';
  if (abs >= 1e15) return +(value / 1e15).toFixed(2) + 'Q';
  if (abs >= 1e12) return +(value / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9) return +(value / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return +(value / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return +(value / 1e3).toFixed(2) + 'K';
  if (abs >= 10) return +value.toFixed(2);
  if (abs >= 0.01) return +value.toFixed(4);
  if (abs >= 0.0001) return +value.toFixed(6);
  if (abs > 0) return +value.toFixed(8);
  return '0';
}


export default function DetailChart({ coin }) {
  const [days, setDays] = useState("30");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [selectedChart, setSelectedChart] = useState("Prices");
  const fetchIdRef = useRef(0);
  const commonBtnClasses = "px-1 base:px-1.5 xs:px-3 md:px-1.5 lg:px-3 py-1 rounded border transition cursor-pointer text-sm font-medium";

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
          timestamp,
          price: prices[i]?.[1] ?? null,
          marketCap: market_caps[i]?.[1] ?? null,
          volume: total_volumes[i]?.[1] ?? null,
        }));

        setChartData(formatted);
        setError(null);
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
            message = data.message;
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

  const isOneDay = days === "1";
  const chartJsData = {
    labels: chartData.map((d) =>
      isOneDay
        ? new Date(chartData[0]?.time).toLocaleDateString() === d.time
          ? d.timestamp
          : d.time
        : d.time
    ),
    datasets: [
      selectedChart === "Prices" && {
        label: "Prices",
        data: chartData.map((d) => Number(d.price)),
        // borderColor: "rgb(75, 192, 192)",
        borderColor: '#c4b5fd',
        backgroundColor: "#c4b5fd",
        tension: 0.1,
        pointRadius: 0,
      },
      selectedChart === "Market Caps" && {
        label: "Market Caps",
        data: chartData.map((d) => Number(d.marketCap)),
        // borderColor: "rgb(255, 99, 132)",
        borderColor: '#c4b5fd',
        backgroundColor: "#c4b5fd",
        tension: 0.1,
        pointRadius: 0,
      },
      selectedChart === "Total Volumes" && {
        label: "Total Volumes",
        data: chartData.map((d) => Number(d.volume)),
        // borderColor: "rgb(53, 162, 235)",
        borderColor: '#c4b5fd',
        backgroundColor: "#c4b5fd",
        tension: 0.1,
        pointRadius: 0,
      },
    ].filter(Boolean),
  };

  const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: selectedChart + " Data - Last " + days + " days",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: function (tooltipItems) {
            if (isOneDay && tooltipItems.length > 0) {
              const idx = tooltipItems[0].dataIndex;
              const d = chartData[idx];
              if (d && d.timestamp) {
                const date = new Date(d.timestamp);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
              }
            }
            return tooltipItems[0].label;
          },
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const value = tooltipItem.parsed.y;
            let formatted = '';
            if (dataset && dataset.label) {
              formatted += dataset.label + ': ';
            }
            formatted += formatCryptoNumber(value);
            if (currency?.label) {
              const code = currency.label.split(' ').pop();
              formatted += ' ' + code;
            }
            return formatted;
          }
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: { display: false },
        grid: {
          display: false,
          drawTicks: true,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          callback: function (value, idx, values) {
            if (isOneDay) {
              const d = chartData[idx];
              if (d && d.timestamp) {
                return new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
            }
            return this.getLabelForValue(value);
          },
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
            return formatCryptoNumber(value);
          }
        }

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
    <div className="w-full sm:w-[90%] lg:w-full mx-auto flex flex-col items-center justify-center gap-4 mt-4">
      {/* {loading && <p>Loading...</p>} */}
      {chartData.length > 0 && (
        <div className="w-full h-[230px] xs:h-[280px] flex flex-col justify-center">
          <Line
            options={chartJsOptions}
            data={chartJsData}
            height={300}
            width={600}
            style={{ display: 'block', width: '100%', height: '100%' }}
          />
        </div>
      )}
      <div className={`w-auto flex h-2 xs:h-4 text-center text-sm xs:text-base mt-1 mb-3 ${error ? 'text-red-500' : 'text-violet-300'}`}>
        {loading ? 'Loading Data, please wait...' :
          error ? error : ''}
      </div>

      <div className="w-full flex flex-col md:flex-row md:justify-between gap-3">
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
        <div className="flex gap-1.5 justify-center">
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
