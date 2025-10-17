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
  userId: string;
  title?: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
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
