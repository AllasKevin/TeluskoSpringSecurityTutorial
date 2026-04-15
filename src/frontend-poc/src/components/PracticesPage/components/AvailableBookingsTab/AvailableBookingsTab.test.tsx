import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AvailableBookingsTab from './AvailableBookingsTab';
import { Booking } from '../../../../types/booking';
import { formatDateTime, getStatusColor } from '../../../../utils/bookingUtils';

const createBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: '1',
  userName: 'alice',
  status: 'PENDING',
  dateTime: new Date('2026-03-01T10:00:00'),
  practice: 'askingpractice',
  responses: [],
  ...overrides,
});

describe('AvailableBookingsTab', () => {
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
    isUserBooking: (b: Booking) => b.userName === 'bob',
    hasUserResponded: () => false,
    setShowPopup: vi.fn(),
    currentBooking: undefined,
    setCurrentBooking: vi.fn(),
  };

  it('renders the heading', () => {
    render(<AvailableBookingsTab {...defaultProps} availableBookings={[]} />);
    expect(screen.getByText('Available Bookings')).toBeInTheDocument();
  });

  it('shows empty message when no bookings', () => {
    render(<AvailableBookingsTab {...defaultProps} availableBookings={[]} />);
    expect(screen.getByText('No bookings found')).toBeInTheDocument();
  });

  it('filters out user-owned bookings', () => {
    const bookings = [
      createBooking({ id: '1', userName: 'bob' }),
      createBooking({ id: '2', userName: 'alice' }),
    ];
    render(<AvailableBookingsTab {...defaultProps} availableBookings={bookings} />);

    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.queryByText('Respond to Booking')).toBeInTheDocument();
  });

  it('filters by practice name', () => {
    const bookings = [
      createBooking({ id: '1', practice: 'askingpractice' }),
      createBooking({ id: '2', practice: 'noticinggame', userName: 'charlie' }),
    ];
    render(<AvailableBookingsTab {...defaultProps} availableBookings={bookings} />);

    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  it('shows all practices when practice is anypractice', () => {
    const bookings = [
      createBooking({ id: '1', practice: 'askingpractice' }),
      createBooking({ id: '2', practice: 'noticinggame', userName: 'charlie' }),
    ];
    render(<AvailableBookingsTab {...defaultProps} practice="anypractice" availableBookings={bookings} />);

    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('charlie')).toBeInTheDocument();
  });
});
