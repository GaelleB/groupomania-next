'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from '@/lib/axios';
import { Post } from '@/types';
import styles from './edit.module.css';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadPost = async () => {
    try {
      const response = await axios.get(`/posts/${params.id}`);
      const postData = response.data;

      if (user && postData.userId !== user.id) {
        alert('Vous n\'êtes pas autorisé à modifier ce post');
        router.push('/posts');
        return;
      }

      setPost(postData);
      setContent(postData.content);
    } catch (error) {
      console.error('Erreur lors du chargement du post:', error);
      alert('Post introuvable');
      router.push('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      await axios.put(`/posts/${params.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push(`/posts/${params.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors de la modification du post');
      console.error('Erreur:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!post) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <h1>Modifier le post</h1>
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
            <label htmlFor="image">Nouvelle image (optionnel)</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {post.image && !image && (
              <p className={styles.currentImage}>Image actuelle : {post.image}</p>
            )}
          </div>

          {error && (
            <div className={styles.alert}>
              ⚠️ {error}
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" disabled={submitting} className={styles.submitBtn}>
              {submitting ? 'Modification...' : 'Modifier'}
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
