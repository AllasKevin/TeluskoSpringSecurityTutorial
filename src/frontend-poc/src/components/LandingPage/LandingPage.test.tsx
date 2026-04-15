import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../assets/mandala.png', () => ({ default: 'mandala.png' }));

describe('LandingPage', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

  it('renders the logo and brand name', () => {
    renderComponent();
    expect(screen.getByText('GrowHub')).toBeInTheDocument();
    expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
  });

  it('renders Google sign-in button', () => {
    renderComponent();
    expect(screen.getByLabelText('Continue with Google')).toBeInTheDocument();
  });

  it('renders Create Account button', () => {
    renderComponent();
    expect(screen.getByLabelText('Create Account')).toBeInTheDocument();
  });

  it('renders Sign In link', () => {
    renderComponent();
    expect(screen.getByLabelText('Sign In')).toBeInTheDocument();
  });

  it('shows error when Google Sign In is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByLabelText('Continue with Google'));
    expect(screen.getByRole('alert')).toHaveTextContent('Google Sign In is not implemented yet');
  });

  it('navigates to register page on Create Account click', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByLabelText('Create Account'));
    expect(mockNavigate).toHaveBeenCalledWith('/registerpage');
  });

  it('navigates to login page on Sign In click', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByLabelText('Sign In'));
    expect(mockNavigate).toHaveBeenCalledWith('/loginpage');
  });
});
