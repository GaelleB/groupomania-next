'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/posts');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <h1>Bienvenue sur Groupomania</h1>
        <p>Le réseau social de votre entreprise</p>
        <div className={styles.buttonContainer}>
          <Link href="/login" className={styles.button}>
            Se connecter
          </Link>
          <Link href="/signup" className={styles.button}>
            S&apos;inscrire
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
