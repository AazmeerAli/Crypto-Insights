import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const DetailChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);
  const [range, setRange] = useState("max"); // default is full history
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    if(!coinId) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: range,
          },
        }
      );

      const { prices, market_caps, total_volumes } = res.data;

      setChartData({
        labels: prices.map(([timestamp]) =>
          new Date(timestamp).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Prices (USD)",
            data: prices.map(([, price]) => price),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.2,
          },
          {
            label: "Market Caps (USD)",
            data: market_caps.map(([, cap]) => cap),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.2,
          },
          {
            label: "Total Volumes (USD)",
            data: total_volumes.map(([, volume]) => volume),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.2)",
            tension: 0.2,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();
  }, [coinId, range]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-end space-x-2 mb-4">
        {["7", "30", "90", "365", "max"].map((option) => (
          <button
            key={option}
            onClick={() => setRange(option)}
            className={`px-3 py-1 rounded ${
              range === option ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {option === "max" ? "All Time" : `${option} Days`}
          </button>
        ))}
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              title: { display: true, text: "Date" },
            },
            y: {
              title: { display: true, text: "Value (USD)" },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default DetailChart;
