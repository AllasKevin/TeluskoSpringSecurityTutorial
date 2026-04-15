export const BOOKING_RESPONSE_STATUS = {
  NOT_ANSWERED: 'NOT_ANSWERED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
} as const;

export type BookingResponseStatus = typeof BOOKING_RESPONSE_STATUS[keyof typeof BOOKING_RESPONSE_STATUS];

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export interface BookingResponse {
  responder: {
    username: string;
  };
  accepted?: boolean;
  responseStatus?: BookingResponseStatus;
}

export interface Booking {
  id: string;
  userName: string;
  status: BookingStatus;
  dateTime: Date;
  practice: string;
  responses?: BookingResponse[];
}

export interface CreateBookingRequest {
  userName: string;
  dateTime: Date;
  practice: string;
}
