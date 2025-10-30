'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { postService } from '@/lib/api';
import { resolveImageUrl } from '@/lib/media';
import { Post } from '@/lib/types';
import styles from './edit.module.css';

const getOwnerId = (data: Post | null) => {
  if (!data) return null;
  return data.UserId;
};

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const existingImageUrl = useMemo(
    () => resolveImageUrl(post?.image && !removeExistingImage ? post.image : null),
    [post?.image, removeExistingImage],
  );

  useEffect(() => {
    let active = true;

    const fetchPost = async () => {
      try {
        const response = await postService.getPost(params.id as string);
        const postData = response.data;

        const ownerId = getOwnerId(postData);
        if (user && ownerId !== null && ownerId !== user.id) {
          alert('Vous n\'etes pas autorise a modifier ce post');
          router.push('/posts');
          return;
        }

        if (!active) {
          return;
        }

        setPost(postData);
        setContent(postData.content ?? '');
        setRemoveExistingImage(false);
        setImage(null);
        setNewImagePreview((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return null;
        });
      } catch (error) {
        console.error('Erreur lors du chargement du post :', error);
        alert('Post introuvable');
        router.push('/posts');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (params.id) {
      fetchPost();
    }

    return () => {
      active = false;
    };
  }, [params.id, router, user]);

  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
    };
  }, [newImagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
      setImage(file);
      setRemoveExistingImage(true);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveExistingImage = () => {
    if (!post?.image) return;
    setRemoveExistingImage(true);
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
      setNewImagePreview(null);
    }
    setImage(null);
  };

  const handleRemoveNewImage = () => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setNewImagePreview(null);
    setImage(null);
    if (post?.image) {
      setRemoveExistingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!content.trim()) {
      setError('Le contenu est obligatoire');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);

      if (removeExistingImage) {
        formData.append('removeImage', 'true');
      }

      if (image) {
        formData.append('image', image);
      }

      await postService.updatePost(params.id as string, formData);

      router.push(`/posts/${params.id}`);
    } catch (err: unknown) {
      const responseError = err as { response?: { data?: { message?: string } } };
      setError(
        responseError.response?.data?.message ||
          'Erreur lors de la modification du post',
      );
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
            <label htmlFor="image">Image</label>
            <input type="file" id="image" onChange={handleImageChange} accept="image/*" />

            {existingImageUrl && (
              <div className={styles.currentImageWrapper}>
                <Image
                  src={existingImageUrl}
                  alt="Image actuelle du post"
                  width={400}
                  height={300}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  priority={false}
                />
                <button
                  type="button"
                  className={styles.removeImageBtn}
                  onClick={handleRemoveExistingImage}
                >
                  Supprimer l&apos;image actuelle
                </button>
              </div>
            )}

            {newImagePreview && (
              <div className={styles.previewWrapper}>
                <Image
                  src={newImagePreview}
                  alt="Prévisualisation de la nouvelle image"
                  width={400}
                  height={300}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  unoptimized
                />
                <button
                  type="button"
                  className={styles.removeImageBtn}
                  onClick={handleRemoveNewImage}
                >
                  Supprimer la nouvelle image
                </button>
              </div>
            )}
          </div>

          {error && <div className={styles.alert}>Attention : {error}</div>}

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
