// components/ObservationFileChart.tsx
import { Bar } from 'react-chartjs-2';

type Props = {
  data: {
    label: string;
    count: number;
    color: string;
  }[];
};

const ObservationFileChart = ({ data }: Props) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Количество наблюдений',
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) => d.color),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Наличие файлов в наблюдениях' },
      legend: { display: false },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 600, height: 400 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ObservationFileChart;
