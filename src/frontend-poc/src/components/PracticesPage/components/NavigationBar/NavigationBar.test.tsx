import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { NavigationBar } from './NavigationBar';

vi.mock('../../../../assets/account.png', () => ({ default: 'account.png' }));
vi.mock('../../../../assets/planner.png', () => ({ default: 'planner.png' }));
vi.mock('../../../../assets/chat-bubble.png', () => ({ default: 'chat-bubble.png' }));
vi.mock('../../../../assets/tuff-ledarskap-wordmark.png', () => ({
  default: 'tuff-ledarskap-wordmark.png',
}));

describe('NavigationBar', () => {
  it('renders all navigation icons', () => {
    const { container } = render(<NavigationBar />);
    expect(container.querySelectorAll('img')).toHaveLength(4);
  });
});
