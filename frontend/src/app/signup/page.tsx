'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './signup.module.css';

export default function SignupPage() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(nom, prenom, email, password);
      router.push('/posts');
    } catch (err: unknown) {
      const responseError = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      const errorMessage =
        responseError.response?.data?.message ??
        responseError.response?.data?.error ??
        "Erreur lors de l'inscription";

      setError(errorMessage);
      console.error("Erreur d'inscription:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.signup}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1>Inscription</h1>
            <p>Rejoignez la communauté Groupomania</p>
          </div>

        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.alert}>Attention : {error}</div>}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nom">Nom</label>
                <input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Dupont"
                  required
                  aria-label="Nom"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="prenom">Prénom</label>
                <input
                  id="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Jean"
                  required
                  aria-label="Prénom"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@groupomania.com"
                required
                aria-label="Email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                aria-label="Mot de passe"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.btnSave}>
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Déjà un compte ?{' '}
              <Link href="/login" className={styles.link}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
