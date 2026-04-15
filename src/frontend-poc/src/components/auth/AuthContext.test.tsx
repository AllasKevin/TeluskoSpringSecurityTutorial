import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

const AuthTestConsumer = () => {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to unauthenticated', () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
  });

  it('reads initial state from localStorage', () => {
    localStorage.setItem('authenticated', 'true');
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
  });

  it('sets authenticated state on login', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(localStorage.getItem('authenticated')).toBe('true');
  });

  it('clears authenticated state on logout', async () => {
    localStorage.setItem('authenticated', 'true');
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByText('Logout'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    expect(localStorage.getItem('authenticated')).toBeNull();
  });
});
