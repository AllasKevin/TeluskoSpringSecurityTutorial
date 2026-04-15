import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingService, mapBackendToFrontend, toApiBooking } from './bookingService';
import apiClient from './api-client';
import { Booking } from '../types/booking';

vi.mock('./api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockApiClient = vi.mocked(apiClient);

const createBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: '1',
  userName: 'alice',
  status: 'PENDING',
  dateTime: new Date('2026-03-01T10:00:00Z'),
  practice: 'askingpractice',
  responses: [],
  ...overrides,
});

const createBackendBooking = (overrides = {}) => ({
  id: 1,
  initialBookerUser: { username: 'alice' },
  status: 'PENDING',
  bookedTime: '2026-03-01T10:00:00.000Z',
  practice: 'askingpractice',
  bookingResponses: [],
  ...overrides,
});

describe('mapBackendToFrontend', () => {
  it('maps all fields correctly', () => {
    const backend = createBackendBooking({
      bookingResponses: [
        { responder: { username: 'bob' }, accepted: true, responseStatus: 'ACCEPTED' },
      ],
    });
    const result = mapBackendToFrontend(backend);

    expect(result.id).toBe('1');
    expect(result.userName).toBe('alice');
    expect(result.status).toBe('PENDING');
    expect(result.practice).toBe('askingpractice');
    expect(result.responses).toHaveLength(1);
    expect(result.responses![0].responder.username).toBe('bob');
    expect(result.responses![0].responseStatus).toBe('ACCEPTED');
  });

  it('uses fallback values when backend fields are missing', () => {
    const result = mapBackendToFrontend({}, { userName: 'fallback', practice: 'fallbackpractice' });
    expect(result.userName).toBe('fallback');
    expect(result.practice).toBe('fallbackpractice');
  });

  it('defaults to Unknown User when no username available', () => {
    const result = mapBackendToFrontend({});
    expect(result.userName).toBe('Unknown User');
  });
});

describe('toApiBooking', () => {
  it('converts frontend booking to API format', () => {
    const booking = createBooking();
    const result = toApiBooking(booking);

    expect(result.initialBookerUser.username).toBe('alice');
    expect(result.bookedTime).toBe('2026-03-01T10:00:00.000Z');
    expect(result.practice).toBe('askingpractice');
    expect(result.status).toBe('PENDING');
  });
});

describe('BookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBookings', () => {
    it('fetches and maps all bookings', async () => {
      mockApiClient.get.mockResolvedValue({ data: [createBackendBooking()] });
      const result = await BookingService.getAllBookings();

      expect(mockApiClient.get).toHaveBeenCalledWith('/bookings');
      expect(result).toHaveLength(1);
      expect(result[0].userName).toBe('alice');
    });

    it('returns empty array for empty response', async () => {
      mockApiClient.get.mockResolvedValue({ data: [] });
      const result = await BookingService.getAllBookings();
      expect(result).toEqual([]);
    });
  });

  describe('getAllFreeBookings', () => {
    it('fetches and maps free bookings', async () => {
      mockApiClient.get.mockResolvedValue({ data: [createBackendBooking()] });
      const result = await BookingService.getAllFreeBookings();

      expect(mockApiClient.get).toHaveBeenCalledWith('/allfreebookings');
      expect(result).toHaveLength(1);
    });
  });

  describe('getBookingsForDateTime', () => {
    it('fetches bookings with a time window', async () => {
      mockApiClient.get.mockResolvedValue({ data: [createBackendBooking()] });
      const dateTime = new Date('2026-03-01T10:00:00Z');
      const result = await BookingService.getBookingsForDateTime(dateTime);

      expect(mockApiClient.get).toHaveBeenCalledWith('/freebookingsbetween', {
        params: expect.objectContaining({
          starttime: expect.any(String),
          endtime: expect.any(String),
        }),
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('updateBookingStatus', () => {
    it('throws when bookingData is missing', async () => {
      await expect(
        BookingService.updateBookingStatus('1', 'CONFIRMED'),
      ).rejects.toThrow('Booking data is required');
    });

    it('sends respond request and maps result', async () => {
      const booking = createBooking();
      mockApiClient.post.mockResolvedValue({ data: createBackendBooking({ status: 'CONFIRMED' }) });

      const result = await BookingService.updateBookingStatus('1', 'CONFIRMED', booking);
      expect(mockApiClient.post).toHaveBeenCalledWith('/respondtobooking', expect.objectContaining({
        status: 'PENDING',
      }));
      expect(result.status).toBe('CONFIRMED');
    });
  });

  describe('createBooking', () => {
    it('creates a booking and maps result', async () => {
      mockApiClient.post.mockResolvedValue({ data: createBackendBooking() });
      const result = await BookingService.createBooking({
        userName: 'alice',
        dateTime: new Date('2026-03-01T10:00:00Z'),
        practice: 'askingpractice',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/bookcall', null, {
        params: expect.objectContaining({
          bookedtime: expect.any(String),
          practice: 'askingpractice',
        }),
      });
      expect(result.userName).toBe('alice');
    });
  });

  describe('acceptBookingResponse', () => {
    it('throws when bookingData is missing', async () => {
      await expect(
        BookingService.acceptBookingResponse('1', 'bob'),
      ).rejects.toThrow('Booking data is required');
    });

    it('accepts a response and maps result', async () => {
      const booking = createBooking({
        responses: [{ responder: { username: 'bob' }, responseStatus: 'NOT_ANSWERED' }],
      });
      mockApiClient.post.mockResolvedValue({
        data: createBackendBooking({
          status: 'CONFIRMED',
          bookingResponses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
        }),
      });

      const result = await BookingService.acceptBookingResponse('1', 'bob', booking);
      expect(result.status).toBe('CONFIRMED');
    });

    it('uses fallback responses when backend returns empty array', async () => {
      const booking = createBooking({
        responses: [{ responder: { username: 'bob' }, responseStatus: 'NOT_ANSWERED' }],
      });
      mockApiClient.post.mockResolvedValue({
        data: createBackendBooking({ bookingResponses: [] }),
      });

      const result = await BookingService.acceptBookingResponse('1', 'bob', booking);
      expect(result.responses![0].responseStatus).toBe('ACCEPTED');
    });
  });

  describe('deleteBooking', () => {
    it('throws when bookingData is missing', async () => {
      await expect(BookingService.deleteBooking('1')).rejects.toThrow('Booking data is required');
    });

    it('sends delete request', async () => {
      const booking = createBooking();
      mockApiClient.post.mockResolvedValue({ data: {} });

      await BookingService.deleteBooking('1', booking);
      expect(mockApiClient.post).toHaveBeenCalledWith('/deletebooking', expect.objectContaining({
        initialBookerUser: { username: 'alice' },
      }));
    });
  });

  describe('withdrawBookingResponse', () => {
    it('withdraws response and maps result', async () => {
      const booking = createBooking();
      mockApiClient.post.mockResolvedValue({ data: createBackendBooking() });

      const result = await BookingService.withdrawBookingResponse('1', booking);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/withdrawbookingresponse',
        expect.objectContaining({ id: null }),
      );
      expect(result.userName).toBe('alice');
    });
  });

  describe('declineBookingResponse', () => {
    it('declines a response and maps result', async () => {
      const booking = createBooking();
      mockApiClient.post.mockResolvedValue({ data: createBackendBooking() });

      const result = await BookingService.declineBookingResponse('1', 'bob', booking);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/declinebookingresponse'),
        expect.any(Object),
      );
      expect(result.userName).toBe('alice');
    });
  });

  describe('withdrawAcceptance', () => {
    it('throws when no accepted response found', async () => {
      const booking = createBooking({ responses: [] });
      await expect(
        BookingService.withdrawAcceptance('1', booking),
      ).rejects.toThrow('No accepted response found to withdraw');
    });

    it('withdraws acceptance and sets all responses to NOT_ANSWERED', async () => {
      const booking = createBooking({
        responses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
      });
      mockApiClient.post.mockResolvedValue({
        data: createBackendBooking({
          bookingResponses: [{ responder: { username: 'bob' }, responseStatus: 'ACCEPTED' }],
        }),
      });

      const result = await BookingService.withdrawAcceptance('1', booking);
      expect(result.responses!.every((r) => r.responseStatus === 'NOT_ANSWERED')).toBe(true);
    });
  });
});
