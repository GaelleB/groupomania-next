'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { postService } from '@/lib/api';
import styles from './newpost.module.css';

export default function NewPostPage() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!content.trim()) {
      setError('Le contenu est obligatoire');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await postService.createPost(formData);

      router.push('/posts');
      setContent('');
      setImage(null);
      setImagePreview(null);
    } catch (err: unknown) {
      const responseError = err as { response?: { data?: { message?: string } } };
      setError(
        responseError.response?.data?.message || 'Erreur lors de la création du post',
      );
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <h1>Cr\u00E9er un nouveau post</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="content">Contenu *</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Que voulez-vous partager ?"
              required
              rows={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image (optionnel)</label>
            <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <Image
                  src={imagePreview}
                  alt="Prévisualisation de l'image"
                  width={400}
                  height={300}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className={styles.removeImageBtn}
                >
                  Supprimer l&apos;image
                </button>
              </div>
            )}
          </div>

          {error && <div className={styles.alert}>Attention : {error}</div>}

          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Publication...' : 'Publier'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelBtn}
            >
              Annuler
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}



