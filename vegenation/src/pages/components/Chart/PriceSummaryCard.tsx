/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface PriceSummaryCardProps {
  latestPrice?: number;       // harga prediksi terakhir (target)
  previousPrice?: number;     // harga prediksi sebelum terakhir (tidak dipakai di versi ini)
  firstPrice?: number;        // harga awal (hari ini)
  date?: string;
  commodityName?: string;
}

const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  latestPrice,
  previousPrice, // meskipun dikirim, kita fokus bandingkan dengan firstPrice
  firstPrice,
  date,
  commodityName
}) => {
  // Cek jika data belum ada (hindari error saat build/prerender)
  if (latestPrice == null || firstPrice == null) {
    return (
      <div style={{ background: '#B1D9AA', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
          Memuat prediksi...
        </div>
      </div>
    );
  }

  // ✅ Logika baru: perubahan dari harga awal (hari ini) ke harga prediksi terakhir
  const changePercent = ((latestPrice - firstPrice) / firstPrice) * 100;
  const roundedChangePercent = Number(changePercent.toFixed(2));

  // Indikator
  let indicator = '';
  let indicatorText = '';
  let indicatorColor = '';

  if (roundedChangePercent > 0) {
    indicator = '🔺';
    indicatorText = 'Naik';
    indicatorColor = 'red';
  } else if (roundedChangePercent < 0) {
    indicator = '🔻';
    indicatorText = 'Turun';
    indicatorColor = 'green';
  } else {
    indicator = '➖';
    indicatorText = 'Stabil';
    indicatorColor = 'gray';
  }

  return (
    <div style={{ background: '#B1D9AA', borderRadius: 12, padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        {/* Judul */}
        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
          Prediksi Harga {commodityName ?? ''}
        </div>

        {/* Harga + Indikator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>
            Rp {latestPrice?.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '-'}
          </div>
          <div style={{
            color: indicatorColor,
            fontSize: 16,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}>
            {indicator} {Math.abs(roundedChangePercent).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% ({indicatorText})
          </div>
        </div>

        {/* Tanggal */}
        <div style={{ fontSize: 12 }}>{date ?? ''}</div>
      </div>
    </div>
  );
};

export default PriceSummaryCard;
