import { Booking } from "./booking";
import { TabType } from "../constants/bookingConstants";

// Common props for all booking-related components
export interface BaseBookingProps {
  currentUsername: string | null;
  formatDateTime: (dateTime: Date) => string;
  getStatusColor: (status: string) => string;
  isUserBooking: (booking: Booking) => boolean;
  hasUserResponded: (booking: Booking) => boolean;
}

// Props for components that handle booking actions
export interface BookingActionProps {
  onRespondToBooking?: (bookingId: string) => void;
  onAcceptBookingResponse?: (bookingId: string, responderUsername: string) => void;
  onDeclineBookingResponse?: (bookingId: string, declinedResponderUsername: string) => void;
  onWithdrawAcceptance?: (bookingId: string) => void;
  onBookingAction?: (bookingId: string) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onWithdrawBookingResponse?: (bookingId: string) => void;
}

// Props for BookingCard component
export interface BookingCardProps extends BaseBookingProps, BookingActionProps {
  booking: Booking;
}

// Props for tab components
export interface TabProps extends BaseBookingProps {
  bookings?: Booking[];
  onBack?: () => void;
}

// Props for ScheduleCallTab
export interface ScheduleCallTabProps extends TabProps, BookingActionProps {
  selectedBookings: Booking[];
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  isMobile: boolean;
  onSearchBookings: () => void;
  onCreateBooking: () => void;
}

// Props for AvailableBookingsTab
export interface AvailableBookingsTabProps extends TabProps, BookingActionProps {
  allBookings: Booking[];
}

// Props for MyBookingsTab
export interface MyBookingsTabProps extends TabProps, BookingActionProps {
  myBookings: Booking[];
  onAcceptBookingResponse: (bookingId: string, responderUsername: string) => void;
}
