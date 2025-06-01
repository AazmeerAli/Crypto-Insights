import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import CryptoListJSON from "./CryptoList.json";
import { CoinContext } from "../../context/CoinContext";

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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const fetchIdRef = useRef(0);

  const {currency}=useContext(CoinContext)

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
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days,currency, currentMatch]);

 const getOption = () => ({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Prices", "Market Caps", "Total Volumes"],
    bottom: 0, // 👈 move legend to bottom
  },
  grid: {
    left: "12%", // 👈 fix label cutoff
    right: "5%",
    bottom: "20%", // enough space for legend
  },
  xAxis: {
    type: "category",
    data: chartData.map((d) => d.time),
  },
 yAxis: [
  {
    type: "value", // 👈 log hatao, linear use karo for better label spacing
    name: currency?.label,
    splitNumber: 6, // 👈 Yeh 5-8 label generate karega
    axisLabel: {
      formatter: (value) => {
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
],

  series: [
    {
      name: "Prices",
      type: "line",
      data: chartData.map((d) => d.price),
      smooth: true,
    },
    {
      name: "Market Caps",
      type: "line",
      data: chartData.map((d) => d.marketCap),
      smooth: true,
    },
    {
      name: "Total Volumes",
      type: "line",
      data: chartData.map((d) => d.volume),
      smooth: true,
    },
  ],
});


  return (
    <div className="mx-auto" style={{ maxWidth: 1000 }}>
      {/* {loading && <p>Loading...</p>} */}
      {chartData.length > 0 && (
        <ReactECharts option={getOption()} style={{ height: 300, width: "100%" }} />
      )}

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
