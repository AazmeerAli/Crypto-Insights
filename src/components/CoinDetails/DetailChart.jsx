import React, { useEffect, useState, useRef, useMemo } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import CryptoListJSON from './CryptoList.json';
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

export default function DetailChart({ coin }) {
  const [days, setDays] = useState("30");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const fetchIdRef = useRef(0);

  const fetchBestMatch = () => {
    if (!coin?.id || !coin?.name || !coin?.symbol) return;
    const myCoin = coin;
    let bestMatch = null;
    let maxMatches = 0;

    for (const c of CryptoListJSON) {
      let matchCount = 0;
      if (c.id.toLowerCase() === myCoin.id.toLowerCase()) matchCount++;
      if (c.name.toLowerCase() === myCoin.name.toLowerCase()) matchCount++;
      if (c.symbol.toLowerCase() === myCoin.symbol.toLowerCase()) matchCount++;
      if (matchCount > maxMatches) {
        bestMatch = c;
        maxMatches = matchCount;
        if (matchCount === 3) break;
      }
    }
    setCurrentMatch(bestMatch);
  };

  useEffect(() => {
    fetchBestMatch();
  }, [coin]);

  const fetchData = async () => {
    if (!currentMatch?.id) return;
    setLoading(true);
    const fetchId = ++fetchIdRef.current;

    try {
      const url = `https://api.coingecko.com/api/v3/coins/${currentMatch.id}/market_chart?vs_currency=usd&days=${days}`;
      const response = await axios.get(url);
      if (fetchId !== fetchIdRef.current) return;

      const { prices, market_caps, total_volumes } = response.data;

      const formatData = (array) =>
        array
          .filter(([timestamp, value]) => typeof value === "number" && !isNaN(value))
          .map(([timestamp, value]) => ({ x: timestamp, y: value }));

      setChartData({
        datasets: [
          {
            label: "Prices (USD)",
            data: formatData(prices),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            tension: 0.1,
            parsing: false,
          },
          {
            label: "Market Caps (USD)",
            data: formatData(market_caps),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            tension: 0.1,
            parsing: false,
          },
          {
            label: "Total Volumes (USD)",
            data: formatData(total_volumes),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            tension: 0.1,
            parsing: false,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!currentMatch?.id) return;

    const timeout = setTimeout(() => {
      fetchData();
    }, 500); // wait 700ms before fetching (you can increase if needed)

    return () => clearTimeout(timeout); // clear on re-render
  }, [days, currentMatch]);





  const chartOptions = useMemo(() => {
    if (!chartData) return {};
    const allYValues = chartData.datasets.flatMap((ds) => ds.data.map((d) => d.y));
    const globalMin = Math.min(...allYValues);
    const globalMax = Math.max(...allYValues);

    return {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: `Market Data - Last ${days} days`,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: days <= 7 ? "hour" : "day",
          },
        },
        y: {
          min: globalMin * 0.95,
          max: globalMax * 1.05,
          ticks: {
            maxTicksLimit: 8, // y-axis par zyada labels dikhane ke liye
            callback: function (value) {
              const abs = Math.abs(value);
              if (abs >= 1e15) return (value / 1e15).toFixed(1) + "Q";
              if (abs >= 1e12) return (value / 1e12).toFixed(1) + "T";
              if (abs >= 1e9) return (value / 1e9).toFixed(1) + "B";
              if (abs >= 1e6) return (value / 1e6).toFixed(1) + "M";
              if (abs >= 1e3) return (value / 1e3).toFixed(1) + "K";
              return value;
            },
          },
        },
      },
    };
  }, [chartData, days]);


  return (
    <div className="mx-auto" style={{ maxWidth: 900 }}>
      {loading && <p>Loading...</p>}
      {chartData && <Line className="h-auto" options={chartOptions} data={chartData} height={'auto'}/>}
      <div className="mt-4 mb-10">
        {optionsList.map((option) => (
          <button
            key={option.value}
            disabled={loading}
            onClick={() => option.value !== days && setDays(option.value)}
            className={`mr-3 px-3 py-1 rounded transition ${days === option.value
              ? "bg-violet-300 text-violet-900"
              : "bg-transparent border border-violet-300 text-violet-300"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
