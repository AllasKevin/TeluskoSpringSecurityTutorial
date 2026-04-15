import { Booking, type BookingResponseStatus } from '../types/booking';
import apiClient from './api-client';

interface BackendBookingResponse {
  responder?: { username: string };
  accepted?: boolean;
  responseStatus?: BookingResponseStatus;
}

interface BackendBooking {
  id?: string | number;
  initialBookerUser?: { username: string };
  status?: string;
  bookedTime?: string;
  practice?: string;
  bookingResponses?: BackendBookingResponse[];
}

function mapBackendToFrontend(backend: BackendBooking, fallback?: Partial<Booking>): Booking {
  return {
    id: backend.id?.toString() ?? fallback?.id ?? Date.now().toString(),
    userName: backend.initialBookerUser?.username ?? fallback?.userName ?? 'Unknown User',
    status: (backend.status ?? fallback?.status ?? 'PENDING') as Booking['status'],
    dateTime: new Date(backend.bookedTime ?? fallback?.dateTime ?? new Date()),
    practice: backend.practice ?? fallback?.practice ?? 'Unknown Practice',
    responses: (backend.bookingResponses ?? []).map((r) => ({
      responder: r.responder ?? { username: 'Unknown' },
      accepted: r.accepted ?? false,
      responseStatus: r.responseStatus ?? 'NOT_ANSWERED',
    })),
  };
}

function toApiBooking(booking: Booking) {
  return {
    initialBookerUser: { username: booking.userName },
    bookedTime: booking.dateTime.toISOString(),
    practice: booking.practice,
    status: booking.status,
  };
}

export class BookingService {
  static async getAllBookings(): Promise<Booking[]> {
    const response = await apiClient.get('/bookings');
    return (response.data as BackendBooking[]).map((b) => mapBackendToFrontend(b));
  }

  static async getAllFreeBookings(): Promise<Booking[]> {
    const response = await apiClient.get('/allfreebookings');
    return (response.data as BackendBooking[]).map((b) => mapBackendToFrontend(b));
  }

  static async getBookingsForDateTime(dateTime: Date): Promise<Booking[]> {
    const startTime = new Date(dateTime.getTime() - 5 * 60 * 1000);
    const endTime = new Date(dateTime.getTime() + 5 * 60 * 1000);

    const response = await apiClient.get('/freebookingsbetween', {
      params: {
        starttime: startTime.toISOString(),
        endtime: endTime.toISOString(),
      },
    });
    return (response.data as BackendBooking[]).map((b) => mapBackendToFrontend(b));
  }

  static async updateBookingStatus(bookingId: string, _status: string, bookingData?: Booking): Promise<Booking> {
    if (!bookingData) {
      throw new Error('Booking data is required');
    }

    const response = await apiClient.post('/respondtobooking', {
      ...toApiBooking(bookingData),
      status: 'PENDING',
    });
    return mapBackendToFrontend(response.data, bookingData);
  }

  static async createBooking(bookingData: { userName: string; dateTime: Date; practice: string }): Promise<Booking> {
    const response = await apiClient.post('/bookcall', null, {
      params: {
        bookedtime: bookingData.dateTime.toISOString(),
        practice: bookingData.practice,
      },
    });
    return mapBackendToFrontend(response.data, {
      userName: bookingData.userName,
      practice: bookingData.practice,
    });
  }

  static async acceptBookingResponse(
    bookingId: string,
    acceptedResponderUsername: string,
    bookingData?: Booking,
  ): Promise<Booking> {
    if (!bookingData) {
      throw new Error('Booking data is required');
    }

    const response = await apiClient.post('/acceptbookingresponse', {
      ...toApiBooking(bookingData),
      status: 'PENDING',
    }, {
      params: { acceptedresponderusername: acceptedResponderUsername },
    });

    const backend = response.data as BackendBooking;
    const frontendBooking = mapBackendToFrontend(backend, bookingData);

    if (!backend.bookingResponses?.length && bookingData.responses?.length) {
      frontendBooking.responses = bookingData.responses.map((r) => ({
        ...r,
        responseStatus: r.responder.username === acceptedResponderUsername
          ? 'ACCEPTED' as const
          : r.responseStatus,
      }));
    }

    return frontendBooking;
  }

  static async deleteBooking(_bookingId: string, bookingData?: Booking): Promise<void> {
    if (!bookingData) {
      throw new Error('Booking data is required');
    }
    await apiClient.post('/deletebooking', toApiBooking(bookingData));
  }

  static async withdrawBookingResponse(bookingId: string, bookingData: Booking): Promise<Booking> {
    const response = await apiClient.post('/withdrawbookingresponse', {
      id: null,
      ...toApiBooking(bookingData),
      bookingResponses: bookingData.responses ?? [],
    });
    return mapBackendToFrontend(response.data, bookingData);
  }

  static async declineBookingResponse(
    bookingId: string,
    declinedResponderUsername: string,
    bookingData: Booking,
  ): Promise<Booking> {
    const response = await apiClient.post(
      `/declinebookingresponse?declinedresponderusername=${encodeURIComponent(declinedResponderUsername)}`,
      { ...toApiBooking(bookingData), status: 'PENDING' },
    );
    return mapBackendToFrontend(response.data, bookingData);
  }

  static async withdrawAcceptance(bookingId: string, bookingData: Booking): Promise<Booking> {
    const acceptedResponse = bookingData.responses?.find(
      (r) => r.responseStatus === 'ACCEPTED',
    );
    const responderUsername = acceptedResponse?.responder?.username;

    if (!responderUsername) {
      throw new Error('No accepted response found to withdraw');
    }

    const response = await apiClient.post(
      `/withdrawacceptbooking?responderusername=${encodeURIComponent(responderUsername)}`,
      {
        id: bookingId,
        ...toApiBooking(bookingData),
        bookingResponses: bookingData.responses ?? [],
      },
    );

    const result = mapBackendToFrontend(response.data, bookingData);
    result.responses = result.responses?.map((r) => ({
      ...r,
      responseStatus: 'NOT_ANSWERED' as const,
    }));
    return result;
  }
}

export { mapBackendToFrontend, toApiBooking };
