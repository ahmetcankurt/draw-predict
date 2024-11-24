import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictionChart = ({ predictions }) => {
  // Eğer tahminler yoksa varsayılan bir veri kümesi göster
  const defaultPredictions = Array(10).fill(0); // 10 sıfırlı bir dizi
  const data = {
    labels: [...Array(10).keys()], // 0-9 arası rakamlar
    datasets: [
      {
        label: "Tahmin Olasılıkları",
        data: predictions || defaultPredictions, // Tahminler varsa onları kullan
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container  shadow-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default PredictionChart;
