import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InviteCodesPage } from './InviteCodesPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../assets/mandala.png', () => ({ default: 'mandala.png' }));
vi.mock('../../assets/filter.png', () => ({ default: 'filter.png' }));

const mockGetMyInviteCodes = vi.fn();
vi.mock('../../services/InviteCodeService', () => ({
  default: {
    getMyInviteCodes: () => mockGetMyInviteCodes(),
  },
}));

describe('InviteCodesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMyInviteCodes.mockResolvedValue({
      data: [
        { inviteCode: 'code-1', available: true, belongsTo: '' },
        { inviteCode: 'code-2', available: false, belongsTo: 'bob' },
      ],
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <InviteCodesPage />
      </MemoryRouter>,
    );

  it('renders the page heading', () => {
    renderComponent();
    expect(screen.getByText('Invite Codes')).toBeInTheDocument();
  });

  it('fetches and displays invite codes', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('code-1')).toBeInTheDocument();
      expect(screen.getByText('code-2')).toBeInTheDocument();
    });
  });

  it('navigates back on Go Back click', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Go Back'));
    expect(mockNavigate).toHaveBeenCalledWith('/app');
  });
});
