import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingReminder from './BookingReminder';
import { BookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';

vi.mock('../../services/bookingService', () => ({
  BookingService: {
    getAllBookings: vi.fn(),
  },
}));

const mockService = vi.mocked(BookingService);

const createConfirmedBooking = (dateTime: Date): Booking => ({
  id: '1',
  userName: 'alice',
  status: 'CONFIRMED',
  dateTime,
  practice: 'askingpractice',
  responses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
});

describe('BookingReminder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    currentUsername: 'alice',
    setShowPopup: vi.fn(),
    setChosenPractice: vi.fn(),
    setCurrentBooking: vi.fn(),
    currentBooking: undefined,
  };

  it('renders nothing when there are no upcoming bookings', async () => {
    mockService.getAllBookings.mockResolvedValue([]);
    const { container } = render(<BookingReminder {...defaultProps} />);

    await waitFor(() => {
      expect(mockService.getAllBookings).toHaveBeenCalled();
    });
    expect(container.querySelector('.booking-reminder-overlay')).toBeNull();
  });

  it('renders nothing when currentUsername is null', () => {
    const { container } = render(
      <BookingReminder {...defaultProps} currentUsername={null} />,
    );
    expect(container.firstChild).toBeNull();
    expect(mockService.getAllBookings).not.toHaveBeenCalled();
  });

  it('shows reminder for booking within 5 minutes', async () => {
    const soonBooking = createConfirmedBooking(
      new Date(Date.now() + 3 * 60 * 1000),
    );
    mockService.getAllBookings.mockResolvedValue([soonBooking]);

    render(<BookingReminder {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/It's Time for Your Booking!/)).toBeInTheDocument();
    });
    expect(screen.getByText('askingpractice')).toBeInTheDocument();
    expect(screen.getByText('Join Call')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('does not show reminder for booking more than 5 minutes away', async () => {
    const farBooking = createConfirmedBooking(
      new Date(Date.now() + 10 * 60 * 1000),
    );
    mockService.getAllBookings.mockResolvedValue([farBooking]);

    const { container } = render(<BookingReminder {...defaultProps} />);

    await waitFor(() => {
      expect(mockService.getAllBookings).toHaveBeenCalled();
    });

    expect(container.querySelector('.booking-reminder-overlay')).toBeNull();
  });

  it('hides when Dismiss is clicked', async () => {
    const soonBooking = createConfirmedBooking(
      new Date(Date.now() + 3 * 60 * 1000),
    );
    mockService.getAllBookings.mockResolvedValue([soonBooking]);
    const user = userEvent.setup();

    render(<BookingReminder {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Dismiss'));
    expect(screen.queryByText(/It's Time for Your Booking!/)).not.toBeInTheDocument();
  });

  it('calls setShowPopup and setCurrentBooking on Join Call', async () => {
    const soonBooking = createConfirmedBooking(
      new Date(Date.now() + 3 * 60 * 1000),
    );
    mockService.getAllBookings.mockResolvedValue([soonBooking]);
    const user = userEvent.setup();

    render(<BookingReminder {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Join Call')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Join Call'));
    expect(defaultProps.setShowPopup).toHaveBeenCalledWith(true);
    expect(defaultProps.setChosenPractice).toHaveBeenCalledWith('askingpractice');
    expect(defaultProps.setCurrentBooking).toHaveBeenCalled();
  });

  it('shows participant name for confirmed bookings', async () => {
    const soonBooking = createConfirmedBooking(
      new Date(Date.now() + 3 * 60 * 1000),
    );
    mockService.getAllBookings.mockResolvedValue([soonBooking]);

    render(<BookingReminder {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('bob')).toBeInTheDocument();
    });
  });

  it('does not show reminder for non-CONFIRMED bookings', async () => {
    const pendingBooking: Booking = {
      ...createConfirmedBooking(new Date(Date.now() + 3 * 60 * 1000)),
      status: 'PENDING',
    };
    mockService.getAllBookings.mockResolvedValue([pendingBooking]);

    const { container } = render(<BookingReminder {...defaultProps} />);

    await waitFor(() => {
      expect(mockService.getAllBookings).toHaveBeenCalled();
    });

    expect(container.querySelector('.booking-reminder-overlay')).toBeNull();
  });
});
