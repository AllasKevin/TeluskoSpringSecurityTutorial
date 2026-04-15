import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
  hasUserWithdrawnResponse,
  getUserRoleText,
  getUserRoleColor,
  isBookingReady,
  getTimeUntilBooking,
} from './bookingUtils';
import { Booking } from '../types/booking';
import { COLORS } from '../constants/bookingConstants';

const createBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: '1',
  userName: 'alice',
  status: 'PENDING',
  dateTime: new Date('2026-03-01T10:00:00'),
  practice: 'askingpractice',
  responses: [],
  ...overrides,
});

describe('formatDateTime', () => {
  it('formats a date to a readable locale string', () => {
    const date = new Date('2026-03-15T14:30:00');
    const result = formatDateTime(date);
    expect(result).toContain('2026');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
  });
});

describe('getStatusColor', () => {
  it('returns warning color for PENDING', () => {
    expect(getStatusColor('PENDING')).toBe(COLORS.WARNING);
  });

  it('returns success color for CONFIRMED', () => {
    expect(getStatusColor('CONFIRMED')).toBe(COLORS.SUCCESS);
  });

  it('returns danger color for CANCELLED', () => {
    expect(getStatusColor('CANCELLED')).toBe(COLORS.DANGER);
  });

  it('returns secondary color for unknown status', () => {
    expect(getStatusColor('UNKNOWN')).toBe(COLORS.SECONDARY);
  });
});

describe('isUserBooking', () => {
  it('returns true when booking belongs to current user', () => {
    const booking = createBooking({ userName: 'alice' });
    expect(isUserBooking(booking, 'alice')).toBe(true);
  });

  it('returns false when booking belongs to a different user', () => {
    const booking = createBooking({ userName: 'bob' });
    expect(isUserBooking(booking, 'alice')).toBe(false);
  });

  it('returns false when currentUsername is null', () => {
    const booking = createBooking();
    expect(isUserBooking(booking, null)).toBe(false);
  });
});

describe('hasUserResponded', () => {
  it('returns true when user has a response on the booking', () => {
    const booking = createBooking({
      responses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
    });
    expect(hasUserResponded(booking, 'bob')).toBe(true);
  });

  it('returns false when user has not responded', () => {
    const booking = createBooking({
      responses: [{ responder: { username: 'charlie' }, responseStatus: 'ACCEPTED' }],
    });
    expect(hasUserResponded(booking, 'bob')).toBe(false);
  });

  it('returns false when responses is undefined', () => {
    const booking = createBooking({ responses: undefined });
    expect(hasUserResponded(booking, 'bob')).toBe(false);
  });

  it('returns false when currentUsername is null', () => {
    const booking = createBooking({
      responses: [{ responder: { username: 'bob' } }],
    });
    expect(hasUserResponded(booking, null)).toBe(false);
  });
});

describe('hasUserWithdrawnResponse', () => {
  it('returns true when user response has NOT_ANSWERED status', () => {
    const booking = createBooking({
      userName: 'alice',
      responses: [{ responder: { username: 'bob' }, responseStatus: 'NOT_ANSWERED' }],
    });
    expect(hasUserWithdrawnResponse(booking, 'bob')).toBe(true);
  });

  it('returns false when user is the initial booker', () => {
    const booking = createBooking({
      userName: 'alice',
      responses: [{ responder: { username: 'alice' }, responseStatus: 'NOT_ANSWERED' }],
    });
    expect(hasUserWithdrawnResponse(booking, 'alice')).toBe(false);
  });

  it('returns false when user has ACCEPTED response', () => {
    const booking = createBooking({
      responses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
    });
    expect(hasUserWithdrawnResponse(booking, 'bob')).toBe(false);
  });

  it('returns false when user has no response', () => {
    const booking = createBooking({ responses: [] });
    expect(hasUserWithdrawnResponse(booking, 'bob')).toBe(false);
  });

  it('returns false when currentUsername is null', () => {
    const booking = createBooking();
    expect(hasUserWithdrawnResponse(booking, null)).toBe(false);
  });

  it('returns false when responses is empty array', () => {
    const booking = createBooking({ responses: [] });
    expect(hasUserWithdrawnResponse(booking, 'bob')).toBe(false);
  });
});

describe('getUserRoleText', () => {
  it('returns checkmark text for user booking', () => {
    expect(getUserRoleText(true, false)).toBe('\u2713 Your booking');
  });

  it('returns empty string when user has responded', () => {
    expect(getUserRoleText(false, true)).toBe('');
  });

  it('returns other user text otherwise', () => {
    expect(getUserRoleText(false, false)).toBe("Other user's booking");
  });
});

describe('getUserRoleColor', () => {
  it('returns success color for user booking', () => {
    expect(getUserRoleColor(true, false)).toBe(COLORS.SUCCESS);
  });

  it('returns primary color when user has responded', () => {
    expect(getUserRoleColor(false, true)).toBe(COLORS.PRIMARY);
  });

  it('returns secondary color otherwise', () => {
    expect(getUserRoleColor(false, false)).toBe(COLORS.SECONDARY);
  });
});

describe('isBookingReady', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true when booking is within 15 minutes in the future', () => {
    const now = new Date('2026-03-01T10:00:00');
    vi.setSystemTime(now);
    const bookingTime = new Date('2026-03-01T10:10:00');
    expect(isBookingReady(bookingTime)).toBe(true);
  });

  it('returns true when booking was up to 5 minutes ago', () => {
    const now = new Date('2026-03-01T10:03:00');
    vi.setSystemTime(now);
    const bookingTime = new Date('2026-03-01T10:00:00');
    expect(isBookingReady(bookingTime)).toBe(true);
  });

  it('returns false when booking is more than 15 minutes away', () => {
    const now = new Date('2026-03-01T09:00:00');
    vi.setSystemTime(now);
    const bookingTime = new Date('2026-03-01T10:00:00');
    expect(isBookingReady(bookingTime)).toBe(false);
  });

  it('returns false when booking was more than 5 minutes ago', () => {
    const now = new Date('2026-03-01T10:10:00');
    vi.setSystemTime(now);
    const bookingTime = new Date('2026-03-01T10:00:00');
    expect(isBookingReady(bookingTime)).toBe(false);
  });

  it('handles non-Date input gracefully', () => {
    const now = new Date('2026-03-01T10:00:00');
    vi.setSystemTime(now);
    const bookingTimeString = '2026-03-01T10:05:00' as unknown as Date;
    expect(isBookingReady(bookingTimeString)).toBe(true);
  });
});

describe('getTimeUntilBooking', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Booking time has passed" when time is past', () => {
    vi.setSystemTime(new Date('2026-03-01T11:00:00'));
    const bookingTime = new Date('2026-03-01T10:00:00');
    expect(getTimeUntilBooking(bookingTime)).toBe('Booking time has passed');
  });

  it('returns minutes remaining when less than 60 minutes', () => {
    vi.setSystemTime(new Date('2026-03-01T09:45:00'));
    const bookingTime = new Date('2026-03-01T10:00:00');
    expect(getTimeUntilBooking(bookingTime)).toBe('15 minutes remaining');
  });

  it('returns singular minute when exactly 1 minute remaining', () => {
    vi.setSystemTime(new Date('2026-03-01T09:59:00'));
    const bookingTime = new Date('2026-03-01T10:00:00');
    expect(getTimeUntilBooking(bookingTime)).toBe('1 minute remaining');
  });

  it('returns hours and minutes when more than 60 minutes', () => {
    vi.setSystemTime(new Date('2026-03-01T08:00:00'));
    const bookingTime = new Date('2026-03-01T10:30:00');
    expect(getTimeUntilBooking(bookingTime)).toBe('2h 30m remaining');
  });
});
