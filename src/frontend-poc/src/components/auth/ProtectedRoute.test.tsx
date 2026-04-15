import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

vi.mock('./AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from './AuthContext';

const mockUseAuth = vi.mocked(useAuth);

const renderWithRouter = (isAuthenticated: boolean) => {
  mockUseAuth.mockReturnValue({
    isAuthenticated,
    login: vi.fn(),
    logout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/" element={<div>Landing Page</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    renderWithRouter(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to landing page when not authenticated', () => {
    renderWithRouter(false);
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
