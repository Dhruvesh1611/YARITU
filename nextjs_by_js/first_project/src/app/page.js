"use client";
import Image from "next/image";
import Link from 'next/link';
import styles from "./page.module.css";

import{useRouter} from "next/navigation";

export default function Home() {
  const Router=useRouter();
  return (
    <>
    <h1>dhruvesh shyara</h1>
    <div className={styles.container}>
      <h1 className={styles.title}>NextJs is fun! 😀</h1>

      <div className={styles.section}>
        <h2>Check Items</h2>
        <Link className={styles.link} href="/items">Items</Link>
      </div>

      <div className={styles.section}>
        <h2>Check Students</h2>
        <Link className={styles.link} href="/students">Students</Link>
      </div>
    </div>
    </>
  );
}
