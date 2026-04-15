import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsersOnlineCounter } from './UsersOnlineCounter';

describe('UsersOnlineCounter', () => {
  it('renders the count of online users', () => {
    render(<UsersOnlineCounter currentlyOnlineUsers={5} />);
    expect(screen.getByText('People Online:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders zero when no users are online', () => {
    render(<UsersOnlineCounter currentlyOnlineUsers={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('updates when the count changes', () => {
    const { rerender } = render(<UsersOnlineCounter currentlyOnlineUsers={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();

    rerender(<UsersOnlineCounter currentlyOnlineUsers={10} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
