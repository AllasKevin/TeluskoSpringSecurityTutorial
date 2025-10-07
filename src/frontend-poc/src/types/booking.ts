// Booking types for the scheduling system

export interface BookingResponse {
  responder: {
    username: string;
  };
  accepted?: boolean;
  responseStatus?: 'NOT_ANSWERED' | 'ACCEPTED' | 'DECLINED';
}

export interface Booking {
  id: string;
  userName: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  dateTime: Date;
  practice: string;
  responses?: BookingResponse[];
}

export interface CreateBookingRequest {
  userName: string;
  dateTime: Date;
  practice: string;
}

export interface UpdateBookingStatusRequest {
  status: 'accepted' | 'declined';
}
