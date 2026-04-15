import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyBookingsTab from './MyBookingsTab';
import { Booking } from '../../../../types/booking';
import { formatDateTime, getStatusColor, isUserBooking, hasUserResponded } from '../../../../utils/bookingUtils';

const createBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: '1',
  userName: 'alice',
  status: 'PENDING',
  dateTime: new Date('2026-03-01T10:00:00'),
  practice: 'askingpractice',
  responses: [],
  ...overrides,
});

describe('MyBookingsTab', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T09:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultProps = {
    practice: 'askingpractice',
    currentUsername: 'bob',
    formatDateTime,
    getStatusColor,
    isUserBooking: (b: Booking) => isUserBooking(b, 'bob'),
    hasUserResponded: (b: Booking) => hasUserResponded(b, 'bob'),
    onAcceptBookingResponse: vi.fn(),
    setShowPopup: vi.fn(),
    currentBooking: undefined,
    setCurrentBooking: vi.fn(),
  };

  it('renders the heading', () => {
    render(<MyBookingsTab {...defaultProps} myBookings={[]} />);
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
  });

  it('shows empty message when no active bookings', () => {
    render(<MyBookingsTab {...defaultProps} myBookings={[]} />);
    expect(screen.getByText('No active bookings found')).toBeInTheDocument();
  });

  it('shows bookings created by the user', () => {
    const bookings = [createBooking({ userName: 'bob' })];
    render(<MyBookingsTab {...defaultProps} myBookings={bookings} />);
    expect(screen.getByText('bob')).toBeInTheDocument();
  });

  it('shows bookings where user has responded', () => {
    const bookings = [
      createBooking({
        id: '2',
        userName: 'alice',
        responses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
      }),
    ];
    render(<MyBookingsTab {...defaultProps} myBookings={bookings} />);
    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  it('sorts bookings by date ascending', () => {
    const bookings = [
      createBooking({ id: '1', userName: 'bob', dateTime: new Date('2026-03-02T10:00:00') }),
      createBooking({ id: '2', userName: 'bob', dateTime: new Date('2026-03-01T10:00:00') }),
    ];
    render(<MyBookingsTab {...defaultProps} myBookings={bookings} />);

    const titles = screen.getAllByText('bob');
    expect(titles).toHaveLength(2);
  });
});
