import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  type StationStats = {
    stationName: string;
    count: number;
  };
  
  type Props = {
    data: StationStats[];
  };
  
  const TopStationsChart = ({ data }: Props) => {
    const chartData = {
      labels: data.map((item) => item.stationName),
      datasets: [
        {
          label: 'Количество наблюдений',
          data: data.map((item) => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  
    return (
      <div style={{ width: '500px', height: '100%', margin: 'auto' }}>
        <Bar
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
              title: { display: true, text: 'Топ-5 станций по числу наблюдений' },
            },
          }}
          data={chartData}
        />
      </div>
    );
  };
  
  export default TopStationsChart;