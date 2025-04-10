// components/ObservationStatusPieChart.tsx
import { Pie } from 'react-chartjs-2';

type Props = {
  data: {
    label: string;
    count: number;
    color: string;
  }[];
};

const ObservationStatusPieChart = ({ data }: Props) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Статусы наблюдений',
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) => d.color),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: {
        display: true,
        text: 'Распределение наблюдений по статусу',
        font: { size: 16 },
      },
    },
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ObservationStatusPieChart;
