// Booking types for the scheduling system

export interface Booking {
  id: string;
  userName: string;
  status: 'pending' | 'accepted' | 'declined';
  dateTime: Date;
  practice: string;
}

export interface CreateBookingRequest {
  userName: string;
  dateTime: Date;
  practice: string;
}

export interface UpdateBookingStatusRequest {
  status: 'accepted' | 'declined';
}
