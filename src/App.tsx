// App.tsx
import './App.css'
import { useEffect, useState } from 'react'

import ObservationDurationChart from './components/ObservationDurationChart'
import ObservationFileChart from './components/ObservationFileChart'
import ObservationStatusPieChart from './components/ObservationStatusPieChart'
import TopStationsChart from './components/TopStationsChart'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import axios from 'axios'
import WaterfallGallery from './components/WaterfallGallery'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
)

function App() {
  const [loading, setLoading] = useState(false);
  const [observations, setObservations] = useState<any[]>([]);
  const [noradImages, setNoradImages] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noradId, setNoradId] = useState('43196');

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (startDate) params.start = startDate;
        if (endDate) params.end = endDate;
        const res = await axios.get(`https://sonik.space/api/observations/`, {
          params
        });
        setObservations(res.data);
      } catch (err) {
        console.error(`Fetch Error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!noradId) return;
      try {
        const res = await axios.get('https://sonik.space/api/observations', {
          params: {
            satellite__norad_cat_id: noradId,
          },
        });
        const filtered = res.data.filter((obs: any) => obs.waterfall);
        setNoradImages(filtered);
      } catch (err) {
        console.error(`Image fetch error: ${err}`);
      }
    };

    fetchImages();
  }, [noradId]);

  const topStationsData = () => {
    const stationCounts: Record<string, number> = {}

    for (const obs of observations) {
      const name = obs.station_name ?? 'Неизвестная'
      stationCounts[name] = (stationCounts[name] || 0) + 1
    }

    const sorted = Object.entries(stationCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([stationName, count]) => ({ stationName, count }))

    const top5 = sorted.slice(0, 5)

    return top5;
  }

  const fileStatsData = () => {
    let waterfall = 0
    let audio = 0
    let demod = 0

    for (const obs of observations) {
      if (obs.waterfall) waterfall++
      if (obs.payload) audio++
      if (Array.isArray(obs.demoddata) && obs.demoddata.length > 0) demod++
    }

    return [
      { label: 'Waterfall', count: waterfall, color: '#36A2EB' },
      { label: 'Аудио (Payload)', count: audio, color: '#4BC0C0' },
      { label: 'Демодуляция', count: demod, color: '#9966FF' },
    ]
  }

  const durationData = () => {
    const grouped: Record<string, { total: number; count: number }> = {}

    for (const obs of observations) {
      const name = obs.station_name ?? 'Неизвестная'
      const start = new Date(obs.start).getTime()
      const end = new Date(obs.end).getTime()
      const durationMin = (end - start) / 60000

      if (!grouped[name]) {
        grouped[name] = { total: 0, count: 0 }
      }

      grouped[name].total += durationMin
      grouped[name].count++
    }

    return Object.entries(grouped)
      .map(([stationName, val]) => ({
        stationName,
        avgMinutes: +(val.total / val.count).toFixed(1),
      }))
      .sort((a, b) => b.avgMinutes - a.avgMinutes)
      .slice(0, 6)
  }

  const statusData = () => {
    const groups: Record<string, number> = {}

    for (const obs of observations) {
      const status = obs.status ?? 'unknown'
      groups[status] = (groups[status] || 0) + 1
    }

    const statusMap: Record<string, { label: string; color: string }> = {
      good: { label: 'Успешные', color: '#4CAF50' },
      bad: { label: 'Неудачные', color: '#F44336' },
      scheduled: { label: 'Запланированные', color: '#FF9800' },
      archived: { label: 'Архивные', color: '#9E9E9E' },
      unknown: { label: 'Неизвестные', color: '#BDBDBD' },
    }

    return Object.entries(groups).map(([key, count]) => ({
      label: statusMap[key]?.label || key,
      count,
      color: statusMap[key]?.color || '#9E9E9E',
    }))
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">Дашборд наблюдений СОНИКС</h1>

        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Дата начала</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-1 shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Дата окончания</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-1 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Загрузка данных...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 shadow rounded">
              <TopStationsChart data={topStationsData()} />
            </div>
            <div className="p-4 shadow rounded">
              <ObservationFileChart data={fileStatsData()} />
            </div>
            <div className="p-4 shadow rounded">
              <ObservationDurationChart data={durationData()} />
            </div>
            <div className="p-4 shadow rounded">
              <ObservationStatusPieChart data={statusData()} />
            </div>
          </div>
        )}


        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">NORAD ID спутника</label>
          <input
            type="text"
            value={noradId}
            onChange={(e) => setNoradId(e.target.value)}
            className="border rounded px-3 py-1 shadow-sm"
            placeholder="например: 43196"
          />
        </div>

        <WaterfallGallery images={noradImages} noradId={noradId} />
      </div>
    </>
  )
}

export default App
