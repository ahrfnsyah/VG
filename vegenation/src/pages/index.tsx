import styles from '@/styles/Home.module.css'
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Vegenation </h1>
      <p className={styles.title1}> see your future commodity price prediction </p>
      <p className={styles.title1}> and read related articles </p>

      <Link href="/dashboard" className={styles.button}>Go to Dashboard</Link>

    </div>
  );
}
