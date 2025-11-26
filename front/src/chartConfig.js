import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

// Register all chart types/scales we rely on once to avoid runtime errors
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default ChartJS;
