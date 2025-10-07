import { Booking } from "../types/booking";

/**
 * Formats a date to a readable string
 */
export const formatDateTime = (dateTime: Date): string => {
  return dateTime.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Gets the color for a booking status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "#ffc107";
    case "CONFIRMED":
      return "#28a745";
    case "CANCELLED":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

/**
 * Checks if a booking belongs to the current user
 */
export const isUserBooking = (booking: Booking, currentUsername: string | null): boolean => {
  return Boolean(currentUsername && booking.userName === currentUsername);
};

/**
 * Checks if the current user has responded to a booking
 */
export const hasUserResponded = (booking: Booking, currentUsername: string | null): boolean => {
  if (!currentUsername || !booking.responses) return false;
  return booking.responses.some(
    (response) => response.responder.username === currentUsername
  );
};

/**
 * Checks if the current user has withdrawn their response to a booking
 * (user had responded but their response was withdrawn)
 * Note: This is only used in My Bookings tab to show withdrawn responses separately
 */
export const hasUserWithdrawnResponse = (booking: Booking, currentUsername: string | null): boolean => {
  if (!currentUsername) return false;
  
  // If user is the initial booker, they can't have withdrawn a response
  if (booking.userName === currentUsername) return false;
  
  // If there are no responses, user hasn't responded or withdrawn
  if (!booking.responses || booking.responses.length === 0) return false;
  
  // Check if user has a response with NOT_ANSWERED status (withdrawn)
  const userResponse = booking.responses.find(
    (response) => response.responder.username === currentUsername
  );
  
  // If user is not in responses array, they never responded
  if (!userResponse) return false;
  
  // If user is in responses array with NOT_ANSWERED status, they withdrew
  return userResponse.responseStatus === 'NOT_ANSWERED';
};

/**
 * Gets the display text for user role in a booking
 */
export const getUserRoleText = (isUser: boolean, hasResponded: boolean): string => {
  if (isUser) {
    return "✓ Your booking";
  } else if (hasResponded) {
    return "📝 You responded to this booking";
  } else {
    return "Other user's booking";
  }
};

/**
 * Gets the color for user role text
 */
export const getUserRoleColor = (isUser: boolean, hasResponded: boolean): string => {
  if (isUser) {
    return "#28a745";
  } else if (hasResponded) {
    return "#007bff";
  } else {
    return "#6c757d";
  }
};

/**
 * Checks if a booking is within 5 minutes of its scheduled time
 */
export const isBookingReady = (bookingDateTime: Date): boolean => {
  const now = new Date();
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const minutesDiff = timeDiff / (1000 * 60);
  return minutesDiff <= 5 && minutesDiff >= 0;
};

/**
 * Gets the time remaining until a booking starts
 */
export const getTimeUntilBooking = (bookingDateTime: Date): string => {
  const now = new Date();
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
  
  if (minutesDiff <= 0) {
    return "Booking time has passed";
  } else if (minutesDiff < 60) {
    return `${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''} remaining`;
  } else {
    const hours = Math.floor(minutesDiff / 60);
    const minutes = minutesDiff % 60;
    return `${hours}h ${minutes}m remaining`;
  }
};
