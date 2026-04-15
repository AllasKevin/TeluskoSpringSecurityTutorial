import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBookings } from './useBookings';
import { BookingService } from '../services/bookingService';
import { Booking } from '../types/booking';

vi.mock('../services/bookingService', () => ({
  BookingService: {
    getBookingsForDateTime: vi.fn(),
    getAllFreeBookings: vi.fn(),
    getAllBookings: vi.fn(),
  },
}));

const mockService = vi.mocked(BookingService);

const createBooking = (id: string, overrides: Partial<Booking> = {}): Booking => ({
  id,
  userName: 'alice',
  status: 'PENDING',
  dateTime: new Date('2026-03-01T10:00:00'),
  practice: 'askingpractice',
  responses: [],
  ...overrides,
});

describe('useBookings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useBookings());

    expect(result.current.selectedBookings).toEqual([]);
    expect(result.current.availableBookings).toEqual([]);
    expect(result.current.myBookings).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('loadBookingsForDate', () => {
    it('loads bookings for a given date', async () => {
      const bookings = [createBooking('1')];
      mockService.getBookingsForDateTime.mockResolvedValue(bookings);

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadBookingsForDate(new Date('2026-03-01T10:00:00'));
      });

      expect(result.current.selectedBookings).toEqual(bookings);
      expect(result.current.error).toBeNull();
    });

    it('filters out CONFIRMED bookings', async () => {
      const bookings = [
        createBooking('1', { status: 'PENDING' }),
        createBooking('2', { status: 'CONFIRMED' }),
      ];
      mockService.getBookingsForDateTime.mockResolvedValue(bookings);

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadBookingsForDate(new Date('2026-03-01T10:00:00'));
      });

      expect(result.current.selectedBookings).toHaveLength(1);
      expect(result.current.selectedBookings[0].id).toBe('1');
    });

    it('clears bookings when date is null', async () => {
      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadBookingsForDate(null);
      });

      expect(result.current.selectedBookings).toEqual([]);
    });

    it('sets error on failure', async () => {
      mockService.getBookingsForDateTime.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadBookingsForDate(new Date());
      });

      expect(result.current.error).toBe('Failed to load bookings');
      expect(result.current.selectedBookings).toEqual([]);
    });
  });

  describe('loadAllFreeBookings', () => {
    it('loads available bookings', async () => {
      const bookings = [createBooking('1')];
      mockService.getAllFreeBookings.mockResolvedValue(bookings);

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadAllFreeBookings();
      });

      expect(result.current.availableBookings).toEqual(bookings);
    });

    it('sets error on failure', async () => {
      mockService.getAllFreeBookings.mockRejectedValue(new Error('fail'));

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadAllFreeBookings();
      });

      expect(result.current.error).toBe('Failed to load available bookings');
    });
  });

  describe('loadMyBookings', () => {
    it('loads user bookings', async () => {
      const bookings = [createBooking('1')];
      mockService.getAllBookings.mockResolvedValue(bookings);

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadMyBookings();
      });

      expect(result.current.myBookings).toEqual(bookings);
    });

    it('sets error on failure', async () => {
      mockService.getAllBookings.mockRejectedValue(new Error('fail'));

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadMyBookings();
      });

      expect(result.current.error).toBe('Failed to load your bookings');
    });
  });

  describe('allBookings deduplication', () => {
    it('deduplicates bookings from myBookings and availableBookings', async () => {
      const sharedBooking = createBooking('1');
      mockService.getAllBookings.mockResolvedValue([sharedBooking]);
      mockService.getAllFreeBookings.mockResolvedValue([sharedBooking]);

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.loadMyBookings();
      });
      await act(async () => {
        await result.current.loadAllFreeBookings();
      });

      await waitFor(() => {
        expect(result.current.allBookings).toHaveLength(1);
      });
    });
  });
});
