'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <div className={styles.profileCard}>
          <h1>Mon Profil</h1>

          {user.image && (
            <Image
              src={user.image}
              alt="Photo de profil"
              width={200}
              height={200}
              className={styles.avatar}
            />
          )}

          <div className={styles.info}>
            <div className={styles.infoItem}>
              <strong>Prénom :</strong>
              <span>{user.prenom}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Nom :</strong>
              <span>{user.nom}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Email :</strong>
              <span>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Rôle :</strong>
              <span>{user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
