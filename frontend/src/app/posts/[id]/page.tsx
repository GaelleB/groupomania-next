'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import axios from '@/lib/axios';
import { Post } from '@/types';
import styles from './post.module.css';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadPost = async () => {
    try {
      const response = await axios.get(`/posts/${params.id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du post:', error);
      alert('Post introuvable');
      router.push('/posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;

    try {
      await axios.delete(`/posts/${params.id}`);
      router.push('/posts');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du post');
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
        <article className={styles.post}>
          <div className={styles.postHeader}>
            <div>
              <h2>{post.user ? `${post.user.prenom} ${post.user.nom}` : 'Utilisateur'}</h2>
              <span className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {user?.id === post.userId && (
              <div className={styles.actions}>
                <button
                  onClick={() => router.push(`/posts/${post.id}/edit`)}
                  className={styles.editBtn}
                >
                  Modifier
                </button>
                <button onClick={deletePost} className={styles.deleteBtn}>
                  Supprimer
                </button>
              </div>
            )}
          </div>

          {post.title && <h1 className={styles.title}>{post.title}</h1>}

          {post.image && (
            <Image
              src={post.image}
              alt="Post"
              width={800}
              height={600}
              className={styles.image}
              style={{ width: '100%', height: 'auto' }}
            />
          )}

          <p className={styles.content}>{post.content}</p>
        </article>

        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Retour
        </button>
      </main>
      <Footer />
    </div>
  );
}
