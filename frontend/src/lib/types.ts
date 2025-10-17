// Types pour les utilisateurs
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Types pour l'authentification
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

// Types pour les posts
export interface Post {
  id: number;
  title?: string;
  content: string;
  imageUrl?: string;
  UserId: number;
  User?: User;
  likes?: number;
  dislikes?: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  image?: File;
}

// Types pour les commentaires
export interface Comment {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  User?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  postId: number;
}
