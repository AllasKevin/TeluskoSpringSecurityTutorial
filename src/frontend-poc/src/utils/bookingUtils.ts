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
