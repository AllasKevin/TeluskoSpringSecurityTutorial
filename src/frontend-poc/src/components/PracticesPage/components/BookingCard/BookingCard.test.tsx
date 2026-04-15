import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingCard from './BookingCard';
import { Booking } from '../../../../types/booking';
import { BookingCardProps } from '../../../../types/bookingComponents';
import {
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
} from '../../../../utils/bookingUtils';

const createBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: '1',
  userName: 'alice',
  status: 'PENDING',
  dateTime: new Date('2026-03-01T10:00:00'),
  practice: 'askingpractice',
  responses: [],
  ...overrides,
});

const createDefaultProps = (overrides: Partial<BookingCardProps> = {}): BookingCardProps => ({
  booking: createBooking(),
  currentUsername: 'bob',
  formatDateTime,
  getStatusColor,
  isUserBooking: (b) => isUserBooking(b, 'bob'),
  hasUserResponded: (b) => hasUserResponded(b, 'bob'),
  setShowPopup: vi.fn(),
  currentBooking: undefined,
  setCurrentBooking: vi.fn(),
  ...overrides,
});

describe('BookingCard', () => {
  it('renders booking header with username, practice, and time', () => {
    render(<BookingCard {...createDefaultProps()} />);
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('askingpractice')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('shows "Respond to Booking" for other user pending booking', () => {
    render(<BookingCard {...createDefaultProps()} />);
    expect(screen.getByText('Respond to Booking')).toBeInTheDocument();
  });

  it('calls onRespondToBooking when respond button is clicked', async () => {
    const onRespondToBooking = vi.fn();
    const user = userEvent.setup();

    render(<BookingCard {...createDefaultProps({ onRespondToBooking })} />);
    await user.click(screen.getByText('Respond to Booking'));
    expect(onRespondToBooking).toHaveBeenCalledWith('1');
  });

  it('shows "Waiting for responses" for own pending booking with no responses', () => {
    const props = createDefaultProps({
      booking: createBooking({ userName: 'bob' }),
      currentUsername: 'bob',
      isUserBooking: () => true,
    });
    render(<BookingCard {...props} />);
    expect(screen.getByText(/Waiting for responses/)).toBeInTheDocument();
    expect(screen.getByText('Cancel Booking')).toBeInTheDocument();
  });

  it('shows accept/decline buttons when own booking has responses', () => {
    const props = createDefaultProps({
      booking: createBooking({
        userName: 'bob',
        responses: [{ responder: { username: 'charlie' }, responseStatus: 'NOT_ANSWERED' }],
      }),
      currentUsername: 'bob',
      isUserBooking: () => true,
    });
    render(<BookingCard {...props} />);
    expect(screen.getByText('charlie')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();
  });

  it('shows "Your response sent" when user has responded to pending booking', () => {
    const props = createDefaultProps({
      booking: createBooking({
        responses: [{ responder: { username: 'bob' }, responseStatus: 'NOT_ANSWERED' }],
      }),
      hasUserResponded: () => true,
    });
    render(<BookingCard {...props} />);
    expect(screen.getByText(/Your response sent/)).toBeInTheDocument();
    expect(screen.getByText('Withdraw Response')).toBeInTheDocument();
  });

  it('shows confirmed booking actions for the booking owner', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T09:50:00'));

    const props = createDefaultProps({
      booking: createBooking({
        userName: 'bob',
        status: 'CONFIRMED',
        responses: [{ responder: { username: 'charlie' }, responseStatus: 'ACCEPTED' }],
      }),
      currentUsername: 'bob',
      isUserBooking: () => true,
    });
    render(<BookingCard {...props} />);
    expect(screen.getByText(/Call confirmed!/)).toBeInTheDocument();
    expect(screen.getByText('Withdraw')).toBeInTheDocument();
    expect(screen.getByText('Cancel Booking')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('shows Ready button when booking is within the ready window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T09:50:00'));

    const props = createDefaultProps({
      booking: createBooking({
        userName: 'bob',
        status: 'CONFIRMED',
        dateTime: new Date('2026-03-01T10:00:00'),
        responses: [{ responder: { username: 'charlie' }, responseStatus: 'ACCEPTED' }],
      }),
      currentUsername: 'bob',
      isUserBooking: () => true,
    });
    render(<BookingCard {...props} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('shows user role text for creator', () => {
    const props = createDefaultProps({
      booking: createBooking({ userName: 'bob' }),
      currentUsername: 'bob',
      isUserBooking: () => true,
    });
    render(<BookingCard {...props} />);
    expect(screen.getByText(/Your booking/)).toBeInTheDocument();
  });

  it('shows "Other user\'s booking" for non-involved user', () => {
    render(<BookingCard {...createDefaultProps()} />);
    expect(screen.getByText("Other user's booking")).toBeInTheDocument();
  });

  it('calls onDeleteBooking when Cancel Booking is clicked', async () => {
    const onDeleteBooking = vi.fn();
    const user = userEvent.setup();

    const props = createDefaultProps({
      booking: createBooking({ userName: 'bob' }),
      currentUsername: 'bob',
      isUserBooking: () => true,
      onDeleteBooking,
    });
    render(<BookingCard {...props} />);
    await user.click(screen.getByText('Cancel Booking'));
    expect(onDeleteBooking).toHaveBeenCalledWith('1');
  });
});
