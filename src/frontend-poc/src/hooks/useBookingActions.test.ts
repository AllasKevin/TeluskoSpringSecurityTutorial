import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookingActions } from './useBookingActions';
import { BookingService } from '../services/bookingService';
import { Booking } from '../types/booking';

vi.mock('../services/bookingService', () => ({
  BookingService: {
    updateBookingStatus: vi.fn(),
    acceptBookingResponse: vi.fn(),
    createBooking: vi.fn(),
    deleteBooking: vi.fn(),
    withdrawBookingResponse: vi.fn(),
    declineBookingResponse: vi.fn(),
    withdrawAcceptance: vi.fn(),
  },
}));

const mockService = vi.mocked(BookingService);

const createBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: '1',
  userName: 'alice',
  status: 'PENDING',
  dateTime: new Date('2026-03-01T10:00:00'),
  practice: 'askingpractice',
  responses: [],
  ...overrides,
});

describe('useBookingActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with isProcessing false', () => {
    const { result } = renderHook(() => useBookingActions());
    expect(result.current.isProcessing).toBe(false);
  });

  describe('respondToBooking', () => {
    it('calls service and invokes onSuccess callback', async () => {
      const booking = createBooking();
      const updated = createBooking({ status: 'CONFIRMED' });
      mockService.updateBookingStatus.mockResolvedValue(updated);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useBookingActions());

      await act(async () => {
        await result.current.respondToBooking('1', booking, onSuccess);
      });

      expect(mockService.updateBookingStatus).toHaveBeenCalledWith('1', 'pending', booking);
      expect(onSuccess).toHaveBeenCalledWith(updated);
      expect(result.current.isProcessing).toBe(false);
    });

    it('re-throws errors while resetting processing state', async () => {
      const booking = createBooking();
      mockService.updateBookingStatus.mockRejectedValue(new Error('fail'));

      const { result } = renderHook(() => useBookingActions());

      await expect(
        act(async () => {
          await result.current.respondToBooking('1', booking);
        }),
      ).rejects.toThrow('fail');

      expect(result.current.isProcessing).toBe(false);
    });
  });

  describe('acceptBookingResponse', () => {
    it('calls service with responder username', async () => {
      const booking = createBooking();
      const updated = createBooking({ status: 'CONFIRMED' });
      mockService.acceptBookingResponse.mockResolvedValue(updated);

      const { result } = renderHook(() => useBookingActions());

      await act(async () => {
        await result.current.acceptBookingResponse('1', 'bob', booking);
      });

      expect(mockService.acceptBookingResponse).toHaveBeenCalledWith('1', 'bob', booking);
    });
  });

  describe('createBooking', () => {
    it('creates a booking and invokes onSuccess', async () => {
      const newBooking = createBooking();
      mockService.createBooking.mockResolvedValue(newBooking);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useBookingActions());

      await act(async () => {
        await result.current.createBooking(new Date(), 'askingpractice', onSuccess);
      });

      expect(mockService.createBooking).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(newBooking);
    });
  });

  describe('deleteBooking', () => {
    it('deletes booking and invokes onSuccess', async () => {
      const booking = createBooking();
      mockService.deleteBooking.mockResolvedValue(undefined);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useBookingActions());

      await act(async () => {
        await result.current.deleteBooking('1', booking, onSuccess);
      });

      expect(mockService.deleteBooking).toHaveBeenCalledWith('1', booking);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('withdrawBookingResponse', () => {
    it('throws when bookingData is undefined', async () => {
      const { result } = renderHook(() => useBookingActions());

      await expect(
        act(async () => {
          await result.current.withdrawBookingResponse('1', undefined);
        }),
      ).rejects.toThrow('Booking data is required for withdraw response');
    });

    it('withdraws response and invokes onSuccess', async () => {
      const booking = createBooking();
      const updated = createBooking();
      mockService.withdrawBookingResponse.mockResolvedValue(updated);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useBookingActions());

      await act(async () => {
        await result.current.withdrawBookingResponse('1', booking, onSuccess);
      });

      expect(onSuccess).toHaveBeenCalledWith(updated);
    });
  });

  describe('declineBookingResponse', () => {
    it('declines response', async () => {
      const booking = createBooking();
      const updated = createBooking();
      mockService.declineBookingResponse.mockResolvedValue(updated);

      const { result } = renderHook(() => useBookingActions());

      await act(async () => {
        await result.current.declineBookingResponse('1', 'bob', booking);
      });

      expect(mockService.declineBookingResponse).toHaveBeenCalledWith('1', 'bob', booking);
    });
  });

  describe('withdrawAcceptance', () => {
    it('withdraws acceptance', async () => {
      const booking = createBooking({
        responses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
      });
      const updated = createBooking();
      mockService.withdrawAcceptance.mockResolvedValue(updated);

      const { result } = renderHook(() => useBookingActions());

      await act(async () => {
        await result.current.withdrawAcceptance('1', booking);
      });

      expect(mockService.withdrawAcceptance).toHaveBeenCalledWith('1', booking);
    });
  });
});
