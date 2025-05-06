// ArticlesCarousel.tsx
import React from 'react';
import Image from 'next/image';
import styles from '@/pages/dashboard/dashboard.module.css';

interface Article {
  date: string;
  description: string;
  img_url: string;
  link: string;
  title: string;
}

interface Props {
  articles: Article[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
}

const ArticleCarousel: React.FC<Props> = ({ articles, index, onPrev, onNext }) => {
  const article = articles[index];

  if (!article) return null;

  return (
    <div className={styles.articleContainer}>
      {/* Tombol Prev */}
      <button onClick={onPrev} className={styles.navButton}>←</button>

      {/* Card Artikel */}
      <div className={styles.articleCard}>

        {/* Gambar */}
        <div style={{ position: 'relative', width: '100%', height: 120, borderRadius: 8, overflow: 'hidden' }}>
          <Image
            src={article.img_url}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            unoptimized
          />
        </div>

        {/* Judul */}
        <h4 className={styles.articleTitle} style={{ fontSize: 12, margin: '8px 0 4px', color: '#333' }}>
          {article.title}
        </h4>

        {/* Deskripsi */}
        <p className={styles.articleDescription} style={{ fontSize: 10, color: '#555', margin: '4px 0' }}>
          {article.description}
        </p>

        {/* Tanggal */}
        <p style={{ fontSize: 8, color: '#999', margin: '4px 0' }}>{article.date}</p>

        {/* Tombol Baca */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.articleLink}
          style={{
            display: 'inline-block',
            marginTop: 6,
            padding: '4px 8px',
            fontSize: 10,
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: 4,
            textDecoration: 'none'
          }}
        >
          Baca selengkapnya
        </a>
      </div>

      {/* Tombol Next */}
      <button onClick={onNext} className={styles.navButton}>→</button>
    </div>
  );
};

export default ArticleCarousel;
