import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

  it('renders embedded heading and upcoming tab', () => {
    render(<MyBookingsTab {...defaultProps} myBookings={[]} />);
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /upcoming/i })).toBeInTheDocument();
  });

  it('shows empty message for upcoming when no bookings', () => {
    render(<MyBookingsTab {...defaultProps} myBookings={[]} />);
    expect(screen.getByText('No upcoming sessions.')).toBeInTheDocument();
  });

  it('shows bookings created by the user in upcoming', () => {
    const bookings = [createBooking({ userName: 'bob' })];
    render(<MyBookingsTab {...defaultProps} myBookings={bookings} />);
    expect(screen.getByText(/with\s+bob/i)).toBeInTheDocument();
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
    expect(screen.getByText(/with\s+alice/i)).toBeInTheDocument();
  });

  it('sorts upcoming bookings by date ascending', () => {
    const bookings = [
      createBooking({ id: '1', userName: 'bob', dateTime: new Date('2026-03-02T10:00:00') }),
      createBooking({ id: '2', userName: 'bob', dateTime: new Date('2026-03-01T10:00:00') }),
    ];
    render(<MyBookingsTab {...defaultProps} myBookings={bookings} />);

    expect(screen.getAllByText(/with\s+bob/i)).toHaveLength(2);
  });

  it('shows past bookings in Past sessions tab', () => {
    const bookings = [
      createBooking({
        id: 'past1',
        userName: 'bob',
        dateTime: new Date('2026-02-01T10:00:00'),
      }),
    ];
    render(<MyBookingsTab {...defaultProps} myBookings={bookings} />);
    fireEvent.click(screen.getByRole('tab', { name: /past sessions/i }));
    expect(screen.getByText(/with\s+bob/i)).toBeInTheDocument();
  });

  it('page layout shows explore link to schedule', () => {
    render(
      <MemoryRouter>
        <MyBookingsTab {...defaultProps} myBookings={[]} pageLayout />
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: /explore schedule/i });
    expect(link).toHaveAttribute('href', '/app/practice/anypractice/schedule');
  });
});
