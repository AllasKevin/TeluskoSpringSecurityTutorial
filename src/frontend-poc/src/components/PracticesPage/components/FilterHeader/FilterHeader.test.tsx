import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FilterHeader } from './FilterHeader';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../assets/filter.png', () => ({ default: 'filter.png' }));

describe('FilterHeader', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <FilterHeader />
      </MemoryRouter>,
    );

  it('renders Practices and Invitation Codes buttons', () => {
    renderComponent();
    expect(screen.getByText('Practices')).toBeInTheDocument();
    expect(screen.getByText('Invitation Codes')).toBeInTheDocument();
  });

  it('navigates to /app/discover when Practices is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Practices'));
    expect(mockNavigate).toHaveBeenCalledWith('/app/discover');
  });

  it('navigates to /invitecodes when Invitation Codes is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Invitation Codes'));
    expect(mockNavigate).toHaveBeenCalledWith('/invitecodes');
  });
});
