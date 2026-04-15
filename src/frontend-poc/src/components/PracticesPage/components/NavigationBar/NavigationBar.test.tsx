import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavigationBar } from './NavigationBar';

vi.mock('../../../../assets/account.png', () => ({ default: 'account.png' }));
vi.mock('../../../../assets/planner.png', () => ({ default: 'planner.png' }));
vi.mock('../../../../assets/chat-bubble.png', () => ({ default: 'chat-bubble.png' }));
vi.mock('../../../../assets/mandala.png', () => ({ default: 'mandala.png' }));

describe('NavigationBar', () => {
  it('renders all navigation icons', () => {
    render(<NavigationBar />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
  });
});
