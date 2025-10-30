// ============================================
// Types pour les utilisateurs
// ============================================
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  image?: string;
  role?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Types pour l'authentification
// ============================================
export interface AuthResponse {
  token: string;
  userId: number;
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

// ============================================
// Types pour les posts
// ============================================
export interface Like {
  id?: number;
  PostId: number;
  UserId: number;
}

export interface Dislike {
  id?: number;
  PostId: number;
  UserId: number;
}

export interface Reaction {
  id?: number;
  PostId: number;
  UserId: number;
  type: 'like' | 'love' | 'wow' | 'sad' | 'angry';
  createdAt?: string;
}

// Type pour l'auteur d'un post (subset de User)
export interface PostAuthor {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  image?: string;
}

export interface Post {
  id: number;
  title?: string | null;
  content: string;
  image?: string | null;
  imageUrl?: string;
  UserId: number;
  User?: PostAuthor;
  user?: PostAuthor; // Alias pour compatibilité backend
  Likes?: Like[];
  Dislikes?: Dislike[];
  Reactions?: Reaction[];
  Comments?: Comment[];
  likes?: number; // Compteur (legacy)
  dislikes?: number; // Compteur (legacy)
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostData {
  content: string;
  image?: File;
  title?: string;
}

export interface UpdatePostData {
  content?: string;
  image?: File;
  title?: string;
  removeImage?: boolean;
}

// ============================================
// Types pour les commentaires
// ============================================
export interface Comment {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  User?: {
    id: number;
    nom: string;
    prenom: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCommentData {
  content: string;
  postId: number;
}

export interface UpdateCommentData {
  content: string;
}

// ============================================
// Types utilitaires
// ============================================
export type ReactionType = Reaction['type'];

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
