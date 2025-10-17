'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      // Seulement rediriger si l'inscription réussit
      router.push('/posts');
    } catch (err: unknown) {
      // Extraire le message d'erreur du backend
      const error = err as { response?: { data?: { message?: string; error?: string } } };
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      console.error('Erreur d\'inscription:', err);
      // NE PAS rediriger en cas d'erreur - rester sur la page pour afficher l'erreur
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.signup}>
        <h1>Inscription</h1>
        <p>Créez votre compte</p>
        <form onSubmit={handleSubmit}>
          <ul>
            <li>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                required
                aria-label="Nom"
              />
            </li>
            <li>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                required
                aria-label="Prénom"
              />
            </li>
            <li>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                required
                aria-label="Email"
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
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
