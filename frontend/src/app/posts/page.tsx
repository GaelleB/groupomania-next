'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { usePosts } from '@/hooks/usePosts';
import { useQueryClient } from '@tanstack/react-query';
import styles from './posts.module.css';

export default function PostsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = usePosts(page, limit);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    refetch();
  };

  const handleNextPage = () => {
    if (data?.pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (data?.pagination.hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  };

  if (authLoading || isLoading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            Erreur lors du chargement des posts. Veuillez réessayer.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getInitials = (prenom?: string, nom?: string) => {
    if (!prenom && !nom) return '??';
    const first = prenom?.charAt(0).toUpperCase() || '';
    const last = nom?.charAt(0).toUpperCase() || '';
    return `${first}${last}`;
  };

  const posts = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.avatar}>{getInitials(user?.prenom, user?.nom)}</div>
          <Link href="/posts/new" className={styles.newPostBtn}>
            Quoi de neuf, {user?.prenom} ?
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className={styles.noPosts}>
            Aucun post pour le moment. Soyez le premier à publier !
          </p>
        ) : (
          <>
            <div className={styles.postsContainer}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleRefresh}
                  onUpdate={() => router.push(`/posts/${post.id}/edit`)}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage}
                className={styles.paginationBtn}
              >
                ← Précédent
              </button>

              <span className={styles.paginationInfo}>
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} posts)
              </span>

              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
                className={styles.paginationBtn}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
        )}
      </main>
      <Footer />
    </div>
  );
}
