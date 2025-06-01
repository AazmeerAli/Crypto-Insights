import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

const MultiAxisLineChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Prices',
        data: [1000, 1200, 1100, 1150, 1300],
        borderColor: 'blue',
        yAxisID: 'y1',
      },
      {
        label: 'Market Caps',
        data: [1e12, 1.1e12, 1.05e12, 1.15e12, 1.2e12],
        borderColor: 'green',
        yAxisID: 'y2',
      },
      {
        label: 'Total Volumes',
        data: [5e9, 6e9, 5.5e9, 6.5e9, 7e9],
        borderColor: 'red',
        yAxisID: 'y3',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Prices',
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Market Caps',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: 'linear',
        position: 'right',
        offset: true,
        title: {
          display: true,
          text: 'Total Volumes',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MultiAxisLineChart;
