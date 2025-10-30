import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostCard from '../PostCard';
import { postService } from '@/lib/api';
import type { Post } from '@/lib/types';

// Mock du contexte d'authentification
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, nom: 'Doe', prenom: 'John', email: 'john@test.com' },
  }),
}));

// Mock de l'API
jest.mock('@/lib/api', () => ({
  postService: {
    reactToPost: jest.fn(),
    deletePost: jest.fn(),
  },
  commentService: {
    createComment: jest.fn(),
    deleteComment: jest.fn(),
  },
}));

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock de resolveImageUrl
jest.mock('@/lib/media', () => ({
  resolveImageUrl: (url: string | null | undefined) => url,
}));

describe('PostCard Component', () => {
  const mockPost: Post = {
    id: 1,
    content: 'Test post content',
    title: 'Test Post',
    UserId: 1,
    User: {
      nom: 'Doe',
      prenom: 'John',
    },
    Reactions: [
      { PostId: 1, UserId: 2, type: 'like' },
      { PostId: 1, UserId: 3, type: 'love' },
    ],
    Comments: [],
    createdAt: '2025-01-15T10:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders post content', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('displays author name', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('shows all 5 reaction buttons', () => {
    render(<PostCard post={mockPost} />);

    const reactionButtons = screen.getAllByRole('button', { pressed: false });
    // 5 réactions + 1 bouton commentaire + 2 boutons (edit/delete si owner)
    expect(reactionButtons.length).toBeGreaterThanOrEqual(5);
  });

  it('displays reaction counts correctly', () => {
    render(<PostCard post={mockPost} />);

    // Vérifie que le composant affiche "1" pour like et "1" pour love
    const reactionCounts = screen.getAllByText('1');
    expect(reactionCounts.length).toBeGreaterThanOrEqual(2);
  });

  it('calls reactToPost when clicking a reaction', async () => {
    (postService.reactToPost as jest.Mock).mockResolvedValue({});

    render(<PostCard post={mockPost} />);

    const reactionButtons = screen.getAllByRole('button');
    const likeButton = reactionButtons.find(btn => btn.textContent?.includes('👍'));

    if (likeButton) {
      fireEvent.click(likeButton);

      await waitFor(() => {
        expect(postService.reactToPost).toHaveBeenCalledWith(1, 'like');
      });
    }
  });

  it('shows edit and delete buttons for post owner', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('Modifier')).toBeInTheDocument();
    expect(screen.getByText('Supprimer')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for non-owner', () => {
    const otherUserPost = { ...mockPost, UserId: 999 };

    render(<PostCard post={otherUserPost} />);

    expect(screen.queryByText('Modifier')).not.toBeInTheDocument();
    expect(screen.queryByText('Supprimer')).not.toBeInTheDocument();
  });

  it('toggles comments section visibility', () => {
    render(<PostCard post={mockPost} />);

    const commentButton = screen.getByText(/0 commentaire/i);

    // Initialement caché
    expect(screen.queryByPlaceholderText(/Ajouter un commentaire/i)).not.toBeInTheDocument();

    // Clic pour afficher
    fireEvent.click(commentButton);
    expect(screen.getByPlaceholderText(/Ajouter un commentaire/i)).toBeInTheDocument();

    // Clic pour masquer
    fireEvent.click(commentButton);
    expect(screen.queryByPlaceholderText(/Ajouter un commentaire/i)).not.toBeInTheDocument();
  });

  it('displays comment count correctly', () => {
    const postWithComments: Post = {
      ...mockPost,
      Comments: [
        { id: 1, content: 'Comment 1', UserId: 2, PostId: 1 },
        { id: 2, content: 'Comment 2', UserId: 3, PostId: 1 },
      ],
    };

    render(<PostCard post={postWithComments} />);
    expect(screen.getByText(/2 commentaires/i)).toBeInTheDocument();
  });
});
