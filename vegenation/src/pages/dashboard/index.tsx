/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import PriceChart from '../components/Chart/PriceChart';
import BarPriceChart from '../components/Chart/BarPriceChart';
import AreaPriceChart from '../components/Chart/AreaPriceChart'; // ✅ Tambahan
import PriceSummaryCard from '../components/Chart/PriceSummaryCard';
import ArticleCarousel from '../components/Articles/ArticlesCarousel';
import ChatBot from '../components/Chatbot/Chatbot';
import { fetchPrediction, fetchArticles } from '@/lib/api';
import { parseISO, format, startOfWeek, startOfMonth } from 'date-fns';

const aggregateData = (data: ChartItem[], mode: 'day' | 'week' | 'month') => {
  if (mode === 'day') return data;

  const grouped: { [key: string]: number[] } = {};

  data.forEach((item) => {
    const date = parseISO(item.name);
    let key = item.name;

    if (mode === 'week') key = format(startOfWeek(date), 'yyyy-MM-dd');
    if (mode === 'month') key = format(startOfMonth(date), 'yyyy-MM');

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item.harga);
  });

  return Object.entries(grouped).map(([key, prices]) => ({
    name: key,
    harga: prices.reduce((sum, p) => sum + p, 0) / prices.length, // average
  }));
};



type ChartItem = {
  name: string;
  harga: number;
};

const Dashboard: React.FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [predictedCommodity, setPredictedCommodity] = useState<string>('');
  const [, setPredictedDate] = useState<string>('');
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);


  const [articles, setArticles] = useState<any[]>([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);

  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line'); // ✅ Tambah "area"
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const handleCommodityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommodity(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handlePredict = async () => {
    if (!selectedCommodity || !selectedDate) {
      return alert('Pilih komoditas dan tanggal terlebih dahulu!');
    }

    try {
      const result = await fetchPrediction(selectedCommodity, 90);
      const data: ChartItem[] = result?.predictions
        ? Object.entries(result.predictions).map(([date, price]) => ({
            name: date,
            harga: Number(price),
          }))
        : [];

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const filtered = data.filter((item) => item.name >= todayStr && item.name <= selectedDate);

      setChartData(filtered);

      setPredictedCommodity(selectedCommodity);
      setPredictedDate(selectedDate);
    } catch (err) {
      alert('Gagal mengambil data prediksi');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles().then((res) => setArticles(res.results || []));
  }, []);

  return (
    <div className={styles.container}>
      {/* Filter */}
      <div className={styles.topFilter}>
        <select className={styles.inputField} value={selectedCommodity} onChange={handleCommodityChange}>
          <option value="">Pilih Komoditas</option>
          <option value="cabai">Cabai</option>
          <option value="bawang_merah">Bawang Merah</option>
          <option value="bawang_putih">Bawang Putih</option>
        </select>
        <input className={styles.inputField} type="date" value={selectedDate} onChange={handleDateChange} />
        <button
          className={styles.button}
          onClick={async () => {
            setIsLoadingChart(true); // ✅ Show loading
            await handlePredict();
            setIsLoadingChart(false); // ✅ Hide loading
          }}
        >
          Prediksi
        </button>
      </div>
  
  
      {/* Konten Utama */}
      <div className={styles.mainContent}>

        
       {/* Chart Section */}
<div className={styles.chartPlaceholder} style={{ flexDirection: 'column', alignItems: 'stretch', position: 'relative' }}>
  {/* ✅ Tagline Atas Chart, hanya muncul setelah klik Prediksi */}
  {predictedCommodity && (
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        📊 Tampilan Grafik Harga Prediksi
      </h2>
    )}

  {/* ✅ Loading Screen */}
  {isLoadingChart && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255,255,255,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
      }}
    >
      ⏳ Memuat prediksi grafik...
    </div>
  )}

  {/* ✅ Pesan Awal Sebelum Prediksi */}
  {!predictedCommodity || chartData.length <= 1 ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 100,
        color: '#777',
        fontSize: 18,
        fontWeight: '500',
      }}
    >
      🔍 Silakan pilih komoditas dan tanggal,
      <br />
      lalu klik <strong>Prediksi</strong> untuk melihat grafik harga.
    </div>
  ) : (
    <>
      {/* Card Ringkasan Harga */}
      <div style={{ marginBottom: 20 }}>
        <PriceSummaryCard
          commodityName={predictedCommodity}
          latestPrice={chartData[chartData.length - 1].harga}
          previousPrice={chartData[chartData.length - 2].harga}
          firstPrice={chartData[0].harga}
          date={chartData[chartData.length - 1].name}
        />
      </div>

      {/* Selector Day/Week/Month + Chart Type */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        {/* Dropdown View Mode */}
        <div style={{ background: '#f0f0f0', borderRadius: 20, padding: 4, display: 'flex' }}>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'day' | 'week' | 'month')}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              border: 'none',
              appearance: 'none',
              backgroundColor: '#4caf50',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#333',
            }}
          >
            <option value="day">📅 Day</option>
            <option value="week">📆 Week</option>
            <option value="month">🗓️ Month</option>
          </select>
        </div>

        {/* Chart Type Selector */}
        <div style={{ background: '#f0f0f0', borderRadius: 20, padding: 4, display: 'flex' }}>
          <button
            onClick={() => setChartType('line')}
            style={{
              border: 'none',
              background: chartType === 'line' ? '#4caf50' : 'transparent',
              color: chartType === 'line' ? '#fff' : '#333',
              padding: '6px 12px',
              borderRadius: 20,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            📈 Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            style={{
              border: 'none',
              background: chartType === 'bar' ? '#4caf50' : 'transparent',
              color: chartType === 'bar' ? '#fff' : '#333',
              padding: '6px 12px',
              borderRadius: 20,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            📊 Bar
          </button>
          <button
            onClick={() => setChartType('area')}
            style={{
              border: 'none',
              background: chartType === 'area' ? '#4caf50' : 'transparent',
              color: chartType === 'area' ? '#fff' : '#333',
              padding: '6px 12px',
              borderRadius: 20,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🟦 Area
          </button>
        </div>
      </div>

      {/* Chart Rendering */}
      {(() => {
        const aggregated = aggregateData(chartData, viewMode);
        if (chartType === 'line') return <PriceChart data={aggregated} />;
        if (chartType === 'bar') return <BarPriceChart data={aggregated} />;
        if (chartType === 'area') return <AreaPriceChart data={aggregated} />;
      })()}
    </>
  )}
</div>

  
        {/* Sidebar */}
        <div className={styles.sidebar}>
           {/* ✅ Artikel */}
  <div className={styles.sidebarItem} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

{/* ✅ Loading Screen */}
{articles.length === 0 ? (
  <div style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
    🔄 Memuat artikel...
  </div>
) : (
  <>
    {/* ✅ Tagline HANYA MUNCUL saat artikel tampil */}
    <div style={{ textAlign: 'center', marginBottom: 10 }}>
      <h2 style={{ fontSize: 14, margin: 0, color: '#333' }}>📰 Artikel Terkait Komoditas</h2>
      <div style={{ width: 30, height: 3, background: '#4caf50', margin: '6px auto 0' }} />
    </div>

    {/* ✅ Artikel */}
    <ArticleCarousel
      articles={articles}
      index={currentArticleIndex}
      onNext={() => setCurrentArticleIndex((i) => (i + 1) % articles.length)}
      onPrev={() => setCurrentArticleIndex((i) => (i - 1 + articles.length) % articles.length)}
    />
  </>
)}

</div>
  
          {/* Chatbot */}
          <div className={styles.sidebarItem1}>
            <div className={styles.chatbotWrapper}>
              <ChatBot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
