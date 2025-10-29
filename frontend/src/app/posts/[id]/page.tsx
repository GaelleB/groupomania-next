'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { postService } from '@/lib/api';
import { resolveImageUrl } from '@/lib/media';
import { Post } from '@/types';
import styles from './post.module.css';

type PostWithRelations = Post & {
  user?: { prenom: string; nom: string };
  User?: { prenom: string; nom: string };
  userId?: number;
  UserId?: number;
};

const getOwnerId = (data: PostWithRelations | null) => {
  if (!data) return null;
  if (data.userId !== undefined && data.userId !== null) return Number(data.userId);
  if (data.UserId !== undefined && data.UserId !== null) return Number(data.UserId);
  return null;
};

const getAuthor = (data: PostWithRelations | null) => {
  if (!data) return null;
  return data.user ?? data.User ?? null;
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadPost = async () => {
    try {
      const response = await postService.getPost(params.id as string);
      setPost(response.data as PostWithRelations);
    } catch (error) {
      console.error('Erreur lors du chargement du post :', error);
      alert('Post introuvable');
      router.push('/posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;

    try {
      await postService.deletePost(params.id as string);
      router.push('/posts');
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      alert('Erreur lors de la suppression du post');
    }
  };

  const imageUrl = useMemo(() => resolveImageUrl(post?.image), [post?.image]);
  const author = getAuthor(post);
  const postOwnerId = getOwnerId(post);

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
              <h2>{author ? `${author.prenom} ${author.nom}` : 'Utilisateur'}</h2>
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
            {user?.id === Number(postOwnerId ?? undefined) && (
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

          {post.title && post.title.trim().length > 0 && (
            <h1 className={styles.title}>{post.title}</h1>
          )}

          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Illustration du post"
              width={800}
              height={600}
              className={styles.image}
              style={{ width: '100%', height: 'auto' }}
            />
          )}

          <p className={styles.content}>{post.content}</p>
        </article>

        <button onClick={() => router.back()} className={styles.backBtn}>
          ? Retour
        </button>
      </main>
      <Footer />
    </div>
  );
}
