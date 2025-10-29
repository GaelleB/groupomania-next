'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>Groupomania</h1>
        </Link>

        {user && (
          <nav className={styles.nav}>
            <Link href="/posts">Fil d&apos;actualité</Link>
            <Link href="/posts/new">Nouveau post</Link>
            <Link href="/profile">Mon profil</Link>
            <button onClick={logout} className={styles.logoutBtn}>
              Déconnexion
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
