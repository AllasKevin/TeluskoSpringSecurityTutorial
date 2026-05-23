import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockRegisterPost = vi.fn();
vi.mock('../../services/RegisterService', () => ({
  default: { post: (...args: unknown[]) => mockRegisterPost(...args) },
}));

const mockGetAvailableInviteCode = vi.fn();
vi.mock('../../services/InviteCodeService', () => ({
  default: {
    getAvailableInviteCode: () => mockGetAvailableInviteCode(),
    getMyInviteCodes: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('RegisterPage', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAvailableInviteCode.mockResolvedValue({ data: validUuid });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

  it('renders the registration form', () => {
    renderComponent();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('fetches and populates an invite code on mount', async () => {
    renderComponent();
    await waitFor(() => {
      expect(mockGetAvailableInviteCode).toHaveBeenCalled();
    });
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('shows success message after successful registration', async () => {
    mockRegisterPost.mockResolvedValue({ data: {} });
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(mockGetAvailableInviteCode).toHaveBeenCalled();
    });

    await user.type(screen.getByPlaceholderText(/username/i), 'newuser');
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'Pass1word');

    const inviteInput = screen.getByPlaceholderText(/invitation code/i);
    await user.clear(inviteInput);
    await user.type(inviteInput, validUuid);

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });
  });

  it('navigates to login page on Sign In click', async () => {
    const user = userEvent.setup();
    renderComponent();

    const signInButtons = screen.getAllByText('Sign In');
    await user.click(signInButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/loginpage');
  });
});
