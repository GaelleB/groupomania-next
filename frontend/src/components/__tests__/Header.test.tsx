import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock du contexte d'authentification
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, nom: 'Doe', prenom: 'John', email: 'john@test.com' },
    logout: jest.fn(),
  }),
}));

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('Header Component', () => {
  it('renders the logo/title', () => {
    render(<Header />);
    const logo = screen.getByText(/Groupomania/i);
    expect(logo).toBeInTheDocument();
  });

  it('shows navigation links when authenticated', () => {
    render(<Header />);
    expect(screen.getByText(/Fil d'actualité/i)).toBeInTheDocument();
    expect(screen.getByText(/Nouveau post/i)).toBeInTheDocument();
    expect(screen.getByText(/Mon profil/i)).toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    render(<Header />);
    const logoutBtn = screen.getByText(/Déconnexion/i);
    expect(logoutBtn).toBeInTheDocument();
  });
});
