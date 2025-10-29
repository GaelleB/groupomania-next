'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postService } from '@/lib/api';
import { resolveImageUrl } from '@/lib/media';
import styles from './PostCard.module.css';

interface Like {
  PostId: number;
  UserId: number;
}

interface Dislike {
  PostId: number;
  UserId: number;
}

interface Reaction {
  PostId: number;
  UserId: number;
  type: 'like' | 'love' | 'wow' | 'sad' | 'angry';
}

interface Comment {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  createdAt?: string;
  User?: {
    nom: string;
    prenom: string;
    id: number;
  };
}

interface Post {
  id: number;
  title?: string | null;
  content: string;
  image?: string | null;
  UserId: number;
  User?: {
    nom: string;
    prenom: string;
  };
  user?: {
    nom: string;
    prenom: string;
  };
  Likes?: Like[];
  Dislikes?: Dislike[];
  Reactions?: Reaction[];
  Comments?: Comment[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Like[]>(post.Likes || []);
  const [dislikes, setDislikes] = useState<Dislike[]>(post.Dislikes || []);
  const [reactions, setReactions] = useState<Reaction[]>(post.Reactions || []);
  const [comments, setComments] = useState<Comment[]>(post.Comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [commentMenuOpen, setCommentMenuOpen] = useState<number | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionPickerTimeout, setReactionPickerTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showReactionDetail, setShowReactionDetail] = useState(false);

  const isLiked = likes.some((like) => like.UserId === user?.id);
  const isDisliked = dislikes.some((dislike) => dislike.UserId === user?.id);
  const userReaction = reactions.find((reaction) => reaction.UserId === user?.id);
  const isOwner = user?.id === post.UserId;
  const commentCount = comments.length;

  const imageUrl = useMemo(() => resolveImageUrl(post.image), [post.image]);
  const author = post.User ?? post.user;

  const getInitials = (prenom?: string, nom?: string) => {
    if (!prenom && !nom) return '??';
    const first = prenom?.charAt(0).toUpperCase() || '';
    const last = nom?.charAt(0).toUpperCase() || '';
    return `${first}${last}`;
  };

  const getReactionEmoji = (type: string) => {
    switch (type) {
      case 'like':
        return '👍';
      case 'love':
        return '❤️';
      case 'wow':
        return '😮';
      case 'sad':
        return '😢';
      case 'angry':
        return '😡';
      default:
        return '👍';
    }
  };

  const getReactionColor = (type: string) => {
    switch (type) {
      case 'like':
        return '#1877f2';
      case 'love':
        return '#f33e58';
      case 'wow':
        return '#f7b125';
      case 'sad':
        return '#f7b125';
      case 'angry':
        return '#e9710f';
      default:
        return '#1877f2';
    }
  };

  const getReactionLabel = (type: string) => {
    switch (type) {
      case 'like':
        return 'J\'aime';
      case 'love':
        return 'J\'adore';
      case 'wow':
        return 'Waouh';
      case 'sad':
        return 'Triste';
      case 'angry':
        return 'Grr';
      default:
        return 'J\'aime';
    }
  };

  const getReactionCounts = () => {
    const counts: Record<string, number> = {};
    reactions.forEach((reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    });
    return counts;
  };

  const totalReactions = reactions.length;
  const reactionCounts = getReactionCounts();

  const handleShowReactionPicker = () => {
    if (reactionPickerTimeout) {
      clearTimeout(reactionPickerTimeout);
      setReactionPickerTimeout(null);
    }
    setShowReactionPicker(true);
  };

  const handleHideReactionPicker = () => {
    const timeout = setTimeout(() => {
      setShowReactionPicker(false);
    }, 300);
    setReactionPickerTimeout(timeout);
  };

  const handleLike = async () => {
    try {
      await postService.likePost(post.id);

      if (isLiked) {
        setLikes((prev) => prev.filter((like) => like.UserId !== user?.id));
        return;
      }

      setLikes((prev) => [...prev, { PostId: post.id, UserId: user!.id }]);
      if (isDisliked) {
        setDislikes((prev) => prev.filter((dislike) => dislike.UserId !== user?.id));
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await postService.dislikePost(post.id);

      if (isDisliked) {
        setDislikes((prev) => prev.filter((dislike) => dislike.UserId !== user?.id));
        return;
      }

      setDislikes((prev) => [...prev, { PostId: post.id, UserId: user!.id }]);
      if (isLiked) {
        setLikes((prev) => prev.filter((like) => like.UserId !== user?.id));
      }
    } catch (error) {
      console.error('Erreur lors du dislike:', error);
    }
  };

  const handleReaction = async (type: 'like' | 'love' | 'wow' | 'sad' | 'angry') => {
    try {
      await postService.reactToPost(post.id, type);

      // Si c'est la même réaction, la supprimer
      if (userReaction?.type === type) {
        setReactions((prev) => prev.filter((reaction) => reaction.UserId !== user?.id));
      } else {
        // Sinon, mettre à jour ou ajouter la réaction
        setReactions((prev) => {
          const filtered = prev.filter((reaction) => reaction.UserId !== user?.id);
          return [...filtered, { PostId: post.id, UserId: user!.id, type }];
        });
      }

      setShowReactionPicker(false);
    } catch (error) {
      console.error('Erreur lors de la réaction:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('\u00CAtes-vous s\u00FBr de vouloir supprimer ce post ?')) {
      return;
    }

    try {
      await postService.deletePost(post.id);
      onDelete?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setNewComment(textarea.value);

    // Reset height to get accurate scrollHeight
    textarea.style.height = '32px';
    // Set new height based on content
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 32), 120);
    textarea.style.height = `${newHeight}px`;
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

      // Utiliser les données renvoyées par le backend
      const addedComment: Comment = {
        id: response.data.data.id,
        content: response.data.data.content,
        UserId: response.data.data.UserId,
        PostId: response.data.data.PostId,
        createdAt: response.data.data.createdAt,
        User: response.data.data.User,
      };

      setComments((prev) => [...prev, addedComment]);
      setNewComment('');

      // Reset textarea height after submit
      const textarea = document.querySelector(`.${styles.commentForm} textarea`) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = '32px';
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('\u00CAtes-vous s\u00FBr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      const { commentService } = await import('@/lib/api');
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setCommentMenuOpen(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
    setCommentMenuOpen(null);
  };

  const handleSaveEditComment = async (commentId: number) => {
    if (!editingCommentContent.trim()) return;

    try {
      const { commentService } = await import('@/lib/api');
      await commentService.updateComment(commentId, { content: editingCommentContent });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editingCommentContent } : c)),
      );
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('Erreur lors de la modification du commentaire:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
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

  const formatCommentDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <article className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{getInitials(author?.prenom, author?.nom)}</div>
          <div className={styles.userDetails}>
            <h3>
              {author?.prenom} {author?.nom}
            </h3>
            <span className={styles.date}>{formatDate(post.createdAt)}</span>
          </div>
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

      {post.title && post.title.trim().length > 0 && (
        <h2 className={styles.title}>{post.title}</h2>
      )}
      <p className={styles.content}>{post.content}</p>

      {imageUrl && (
        <img src={imageUrl} alt="Illustration du post" className={styles.image} />
      )}

      {totalReactions > 0 && (
        <div className={styles.reactionSummaryTop}>
          <button
            className={styles.reactionCountBtn}
            onClick={() => setShowReactionDetail(!showReactionDetail)}
          >
            <div className={styles.reactionEmojis}>
              {Object.keys(reactionCounts).map((type, index) => (
                <span
                  key={type}
                  className={styles.reactionEmojiStack}
                  style={{ zIndex: 10 - index }}
                >
                  {getReactionEmoji(type)}
                </span>
              ))}
            </div>
            <span className={styles.reactionTotal}>{totalReactions}</span>
          </button>

          {showReactionDetail && (
            <div className={styles.reactionDetailPopup}>
              {Object.entries(reactionCounts).map(([type, count]) => (
                <div key={type} className={styles.reactionDetailItem}>
                  <span className={styles.reactionDetailEmoji}>{getReactionEmoji(type)}</span>
                  <span className={styles.reactionDetailLabel}>{getReactionLabel(type)}</span>
                  <span className={styles.reactionDetailCount}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.interactions}>
        <div className={styles.reactionContainer}>
          <button
            onClick={() => handleReaction('like')}
            onMouseEnter={handleShowReactionPicker}
            onMouseLeave={handleHideReactionPicker}
            className={`${styles.reactionBtn} ${userReaction ? styles.active : ''}`}
            style={userReaction ? { color: userReaction.type === 'love' ? '#f02849' : userReaction.type === 'angry' ? '#f7b125' : '#1877f2' } : {}}
          >
            {userReaction ? getReactionEmoji(userReaction.type) : '👍'}{' '}
            {userReaction ? getReactionLabel(userReaction.type) : 'J\'aime'}
          </button>

          {showReactionPicker && (
            <div
              className={styles.reactionPicker}
              onMouseEnter={handleShowReactionPicker}
              onMouseLeave={handleHideReactionPicker}
            >
              <button onClick={() => handleReaction('like')} className={styles.reactionOption}>
                <span className={styles.reactionEmojiLarge}>👍</span>
              </button>
              <button onClick={() => handleReaction('love')} className={styles.reactionOption}>
                <span className={styles.reactionEmojiLarge}>❤️</span>
              </button>
              <button onClick={() => handleReaction('wow')} className={styles.reactionOption}>
                <span className={styles.reactionEmojiLarge}>😮</span>
              </button>
              <button onClick={() => handleReaction('sad')} className={styles.reactionOption}>
                <span className={styles.reactionEmojiLarge}>😢</span>
              </button>
              <button onClick={() => handleReaction('angry')} className={styles.reactionOption}>
                <span className={styles.reactionEmojiLarge}>😡</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className={styles.commentToggle}
          aria-expanded={showComments}
        >
          💬 Commenter
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          {comments.length > 0 && (
            <div className={styles.comments}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentWrapper}>
                  <div className={styles.commentBubble}>
                    <div className={styles.commentHeader}>
                      <strong>
                        {comment.User?.prenom} {comment.User?.nom}
                      </strong>
                      {user?.id === comment.UserId && (
                        <div className={styles.commentMenu}>
                          <button
                            onClick={() =>
                              setCommentMenuOpen(
                                commentMenuOpen === comment.id ? null : comment.id,
                              )
                            }
                            className={styles.commentMenuBtn}
                          >
                            ⋯
                          </button>
                          {commentMenuOpen === comment.id && (
                            <div className={styles.commentMenuDropdown}>
                              <button onClick={() => handleEditComment(comment)}>
                                Modifier
                              </button>
                              <button onClick={() => handleDeleteComment(comment.id)}>
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className={styles.editCommentForm}>
                        <textarea
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                          rows={3}
                        />
                        <div className={styles.editCommentActions}>
                          <button onClick={handleCancelEdit}>Annuler</button>
                          <button onClick={() => handleSaveEditComment(comment.id)}>
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{comment.content}</p>
                    )}
                  </div>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentDate}>
                      {formatCommentDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Ajouter un commentaire..."
              disabled={addingComment}
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
