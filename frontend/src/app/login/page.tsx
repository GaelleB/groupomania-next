'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        <h1>Connexion</h1>
        <p>Veuillez saisir votre email et votre mot de passe</p>
        <form onSubmit={handleSubmit}>
          <ul>
            <li>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                required
                aria-label="Email de connexion"
              />
            </li>
            <li>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                aria-label="Mot de passe"
              />
            </li>
          </ul>
          {error && (
            <div className={styles.alert}>
              ⚠️ {error}
            </div>
          )}
          <button type="submit" disabled={loading} className={styles.btnSave}>
            {loading ? 'Connexion...' : 'Valider'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
