// components/ObservationDurationChart.tsx
import { Bar } from 'react-chartjs-2';

type Props = {
  data: {
    stationName: string;
    avgMinutes: number;
  }[];
};

const ObservationDurationChart = ({ data }: Props) => {
  const chartData = {
    labels: data.map((d) => d.stationName),
    datasets: [
      {
        label: 'Средняя длительность (мин)',
        data: data.map((d) => d.avgMinutes),
        backgroundColor: '#FF6384',
        categoryPercentage: 0.5,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Средняя длительность наблюдений по станциям',
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Минуты' },
        beginAtZero: true,
      },
      y: {
        ticks: { padding: 15 },
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, height: 400 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ObservationDurationChart;
