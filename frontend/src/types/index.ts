export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  image?: string;
  role: string;
}

export interface Post {
  id: string;
  userId?: string;
  UserId?: string;
  title?: string | null;
  content: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  User?: User;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: User;
}

export interface AuthResponse {
  userId: string;
  token: string;
}
