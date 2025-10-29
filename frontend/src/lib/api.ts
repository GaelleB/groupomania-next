import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    // Vérifier que nous sommes côté client avant d'accéder au localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne rediriger que si c'est une erreur d'authentification (token invalide)
    // et qu'on n'est pas déjà sur les pages de login/signup
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthPage =
        window.location.pathname === '/login' || window.location.pathname === '/signup';
      const isTokenError =
        error.response?.data?.error?.includes('token') ||
        error.response?.data?.error?.includes('Token');

      if (!isAuthPage && isTokenError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// Services d'authentification
export const authService = {
  signup: (data: { nom: string; prenom: string; email: string; password: string }) =>
    api.post('/auth/signup', data),

  login: (data: { email: string; password: string }) => api.post('/auth/login', data),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Services pour les posts
export const postService = {
  getAllPosts: () => api.get('/posts'),

  getPost: (id: string | number) => api.get(`/posts/${id}`),

  createPost: (formData: FormData) => api.post('/posts/newpost', formData),

  updatePost: (id: string | number, formData: FormData) =>
    api.put(`/posts/${id}`, formData),

  deletePost: (id: string | number) => api.delete(`/posts/${id}`),

  likePost: (id: string | number) => api.post(`/posts/${id}/like`),

  dislikePost: (id: string | number) => api.post(`/posts/${id}/dislike`),
};

// Services pour les commentaires
export const commentService = {
  getComments: (postId: string | number) => api.get(`/comments/${postId}`),

  createComment: (data: { postId: number; content: string }) => api.post('/comments', data),

  deleteComment: (id: string | number) => api.delete(`/comments/${id}`),
};

// Service pour le profil utilisateur
export const userService = {
  getProfile: (id: string) => api.get(`/auth/user/${id}`),

  updateProfile: (id: string, data: Record<string, unknown>) =>
    api.put(`/auth/user/${id}`, data),

  deleteAccount: (id: string) => api.delete(`/auth/user/${id}`),
};
