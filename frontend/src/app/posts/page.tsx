'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { postService } from '@/lib/api';
import styles from './posts.module.css';

interface Like {
  PostId: number;
  UserId: number;
}

interface Dislike {
  PostId: number;
  UserId: number;
}

interface Comment {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  User?: {
    nom: string;
    prenom: string;
    id: number;
  };
}

interface Post {
  id: number;
  title?: string;
  content: string;
  image?: string;
  UserId: number;
  User?: {
    nom: string;
    prenom: string;
  };
  Likes?: Like[];
  Dislikes?: Dislike[];
  Comments?: Comment[];
  createdAt: string;
}

export default function PostsPage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadPosts = React.useCallback(async () => {
    try {
      const response = await postService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, loadPosts]);

  if (authLoading || loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Fil d'actualité</h1>
          <Link href="/posts/new" className={styles.newPostBtn}>
            Nouveau post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className={styles.noPosts}>
            Aucun post pour le moment. Soyez le premier à publier !
          </p>
        ) : (
          <div className={styles.postsContainer}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={loadPosts}
                onUpdate={() => router.push(`/posts/${post.id}/edit`)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
