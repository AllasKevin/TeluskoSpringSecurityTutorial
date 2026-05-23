import { Booking } from './booking';

export interface BaseBookingProps {
  currentUsername: string | null;
  formatDateTime: (dateTime: Date) => string;
  getStatusColor: (status: string) => string;
  isUserBooking: (booking: Booking) => boolean;
  hasUserResponded: (booking: Booking) => boolean;
  currentBooking: Booking | undefined;
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
}

export interface BookingActionProps {
  onRespondToBooking?: (bookingId: string) => void;
  onAcceptBookingResponse?: (bookingId: string, responderUsername: string) => void;
  onDeclineBookingResponse?: (bookingId: string, declinedResponderUsername: string) => void;
  onWithdrawAcceptance?: (bookingId: string) => void;
  onBookingAction?: (bookingId: string) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onWithdrawBookingResponse?: (bookingId: string) => void;
}

export interface BookingCardProps extends BaseBookingProps, BookingActionProps {
  booking: Booking;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  /** Editorial layout for practice schedule session list (matches phone mock + Relational Architect). */
  cardLayout?: 'default' | 'schedule';
}

export interface TabProps extends BaseBookingProps {
  practice: string;
  bookings?: Booking[];
  onBack?: () => void;
}

export interface ScheduleCallTabProps extends TabProps, BookingActionProps {
  selectedBookings: Booking[];
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  isMobile: boolean;
  onSearchBookings: () => void;
  onCreateBooking: () => void;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  allBookings: Booking[];
  /** Full-page schedule route uses fixed CTA above BottomNav; modal uses inline CTA. */
  layout?: 'page' | 'embedded';
}

export interface AvailableBookingsTabProps extends TabProps, BookingActionProps {
  availableBookings: Booking[];
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MyBookingsTabProps extends TabProps, BookingActionProps {
  myBookings: Booking[];
  onAcceptBookingResponse: (bookingId: string, responderUsername: string) => void;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  /** Full-page /app/my-bookings: no inner title; tabs + editorial cards + explore CTA. */
  pageLayout?: boolean;
}
