import { Booking, BOOKING_STATUS, type BookingStatus } from '../types/booking';
import { COLORS } from '../constants/bookingConstants';

const READY_WINDOW_MINUTES_BEFORE = 15;
const READY_WINDOW_MINUTES_AFTER = 5;

export const formatDateTime = (dateTime: Date): string => {
  return dateTime.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const STATUS_COLOR_MAP: Record<string, string> = {
  [BOOKING_STATUS.PENDING]: COLORS.WARNING,
  [BOOKING_STATUS.CONFIRMED]: COLORS.SUCCESS,
  [BOOKING_STATUS.CANCELLED]: COLORS.DANGER,
};

export const getStatusColor = (status: string): string => {
  return STATUS_COLOR_MAP[status] ?? COLORS.SECONDARY;
};

export const isUserBooking = (booking: Booking, currentUsername: string | null): boolean => {
  return Boolean(currentUsername && booking.userName === currentUsername);
};

export const hasUserResponded = (booking: Booking, currentUsername: string | null): boolean => {
  if (!currentUsername || !booking.responses) return false;
  return booking.responses.some(
    (response) => response.responder.username === currentUsername
  );
};

export const hasUserWithdrawnResponse = (booking: Booking, currentUsername: string | null): boolean => {
  if (!currentUsername) return false;
  if (booking.userName === currentUsername) return false;
  if (!booking.responses || booking.responses.length === 0) return false;

  const userResponse = booking.responses.find(
    (response) => response.responder.username === currentUsername
  );

  if (!userResponse) return false;
  return userResponse.responseStatus === 'NOT_ANSWERED';
};

export const getUserRoleText = (isUser: boolean, hasResponded: boolean): string => {
  if (isUser) return '\u2713 Your booking';
  if (hasResponded) return '';
  return "Other user's booking";
};

export const getUserRoleColor = (isUser: boolean, hasResponded: boolean): string => {
  if (isUser) return COLORS.SUCCESS;
  if (hasResponded) return COLORS.PRIMARY;
  return COLORS.SECONDARY;
};

export const isBookingReady = (bookingDateTime: Date): boolean => {
  const now = new Date();
  const bookingDate = bookingDateTime instanceof Date ? bookingDateTime : new Date(bookingDateTime);
  const timeDiff = bookingDate.getTime() - now.getTime();
  const minutesDiff = timeDiff / (1000 * 60);

  return minutesDiff <= READY_WINDOW_MINUTES_BEFORE && minutesDiff >= -READY_WINDOW_MINUTES_AFTER;
};

export const getTimeUntilBooking = (bookingDateTime: Date): string => {
  const now = new Date();
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const minutesDiff = Math.ceil(timeDiff / (1000 * 60));

  if (minutesDiff <= 0) {
    return 'Booking time has passed';
  }

  if (minutesDiff < 60) {
    return `${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''} remaining`;
  }

  const hours = Math.floor(minutesDiff / 60);
  const minutes = minutesDiff % 60;
  return `${hours}h ${minutes}m remaining`;
};
