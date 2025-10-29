'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/posts');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.login}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1>Connexion</h1>
            <p>Content de vous revoir !</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.alert}>
                ⚠️ {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@groupomania.com"
                required
                aria-label="Email de connexion"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                aria-label="Mot de passe"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.btnSave}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>Pas encore de compte ? <Link href="/signup" className={styles.link}>S&apos;inscrire</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
