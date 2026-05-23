import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../auth/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockPost = vi.fn();
vi.mock('../../services/LoginService', () => ({
  default: { post: (...args: unknown[]) => mockPost(...args) },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

  it('renders login form with username and password fields', () => {
    renderComponent();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the brand name', () => {
    renderComponent();
    expect(screen.getByText('Tuff Anytime')).toBeInTheDocument();
  });

  it('shows validation error for empty username', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'ab');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 4 characters')).toBeInTheDocument();
    });
  });

  it('calls login service and navigates on successful submit', async () => {
    mockPost.mockResolvedValue({ data: {} });
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'testpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'testuser', password: 'testpass' }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/app');
    });
  });

  it('navigates to register page on Sign up click', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Sign up'));
    expect(mockNavigate).toHaveBeenCalledWith('/registerpage');
  });
});
