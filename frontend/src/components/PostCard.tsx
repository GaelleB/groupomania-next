'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postService } from '@/lib/api';
import { resolveImageUrl } from '@/lib/media';
import { Post, Like, Dislike, Comment } from '@/lib/types';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Like[]>(post.Likes || []);
  const [dislikes, setDislikes] = useState<Dislike[]>(post.Dislikes || []);
  const [comments, setComments] = useState<Comment[]>(post.Comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const isLiked = likes.some((like) => like.UserId === user?.id);
  const isDisliked = dislikes.some((dislike) => dislike.UserId === user?.id);
  const isOwner = user?.id === post.UserId;
  const commentCount = comments.length;

  const imageUrl = useMemo(() => resolveImageUrl(post.image), [post.image]);
  const author = post.User ?? post.user;

  const handleLike = async () => {
    try {
      await postService.likePost(post.id);

      if (isLiked) {
        setLikes((prev) => prev.filter((like) => like.UserId !== user?.id));
      } else {
        setLikes((prev) => [...prev, { PostId: post.id, UserId: user!.id }]);
        if (isDisliked) {
          setDislikes((prev) => prev.filter((dislike) => dislike.UserId !== user?.id));
        }
      }
    } catch (error) {
      console.error('Erreur lors du like :', error);
    }
  };

  const handleDislike = async () => {
    try {
      await postService.dislikePost(post.id);

      if (isDisliked) {
        setDislikes((prev) => prev.filter((dislike) => dislike.UserId !== user?.id));
      } else {
        setDislikes((prev) => [...prev, { PostId: post.id, UserId: user!.id }]);
        if (isLiked) {
          setLikes((prev) => prev.filter((like) => like.UserId !== user?.id));
        }
      }
    } catch (error) {
      console.error('Erreur lors du dislike :', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      return;
    }

    try {
      await postService.deletePost(post.id);
      onDelete?.();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setAddingComment(true);
    try {
      const { commentService } = await import('@/lib/api');
      const response = await commentService.createComment({
        postId: post.id,
        content: newComment,
      });

      const addedComment: Comment = {
        id: response.data.data?.id || Date.now(),
        content: newComment,
        UserId: user.id,
        PostId: post.id,
        User: {
          nom: user.nom,
          prenom: user.prenom,
          id: user.id,
        },
      };

      setComments((prev) => [...prev, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      const { commentService } = await import('@/lib/api');
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire :', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <article className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <h3>
            {author?.prenom} {author?.nom}
          </h3>
          <span className={styles.date}>{formatDate(post.createdAt)}</span>
        </div>
        {isOwner && (
          <div className={styles.actions}>
            <button onClick={onUpdate} className={styles.editBtn}>
              Modifier
            </button>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              Supprimer
            </button>
          </div>
        )}
      </div>

      {post.title && <h2 className={styles.title}>{post.title}</h2>}
      <p className={styles.content}>{post.content}</p>

      {imageUrl && (
        <img src={imageUrl ?? ''} alt="Illustration du post" className={styles.image} />
      )}

      <div className={styles.interactions}>
        <div className={styles.reactions}>
          <button
            onClick={handleLike}
            className={`${styles.likeBtn} ${isLiked ? styles.active : ''}`}
            aria-pressed={isLiked}
          >
            ?? {likes.length}
          </button>
          <button
            onClick={handleDislike}
            className={`${styles.dislikeBtn} ${isDisliked ? styles.active : ''}`}
            aria-pressed={isDisliked}
          >
            ?? {dislikes.length}
          </button>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className={styles.commentToggle}
          aria-expanded={showComments}
        >
          ?? {commentCount} commentaire{commentCount > 1 ? 's' : ''}
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          {comments.length > 0 && (
            <div className={styles.comments}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <strong>
                      {comment.User?.prenom} {comment.User?.nom}
                    </strong>
                    {user?.id === comment.UserId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className={styles.deleteCommentBtn}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              disabled={addingComment}
              rows={3}
            />
            <button type="submit" disabled={addingComment || !newComment.trim()}>
              {addingComment ? 'Envoi...' : 'Commenter'}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
