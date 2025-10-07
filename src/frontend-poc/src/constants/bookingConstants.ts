// Tab types
export const TAB_TYPES = {
  SCHEDULE: "schedule",
  AVAILABLE: "available", 
  MY_BOOKINGS: "mybookings",
} as const;

export type TabType = typeof TAB_TYPES[keyof typeof TAB_TYPES];

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  CONFIRMED: "confirmed",
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Colors
export const COLORS = {
  PRIMARY: "#007bff",
  SUCCESS: "#28a745",
  WARNING: "#ffc107",
  DANGER: "#dc3545",
  SECONDARY: "#6c757d",
  LIGHT: "#f8f9fa",
} as const;

// Button styles
export const BUTTON_STYLES = {
  PRIMARY: {
    backgroundColor: COLORS.PRIMARY,
    color: "white",
  },
  SECONDARY: {
    backgroundColor: COLORS.SECONDARY,
    color: "white",
  },
  SUCCESS: {
    backgroundColor: COLORS.SUCCESS,
    color: "white",
  },
  DANGER: {
    backgroundColor: COLORS.DANGER,
    color: "white",
  },
} as const;

// Common spacing
export const SPACING = {
  SMALL: "8px",
  MEDIUM: "12px",
  LARGE: "20px",
  XLARGE: "24px",
} as const;

// Font sizes
export const FONT_SIZES = {
  SMALL: "0.8rem",
  MEDIUM: "0.9rem",
  LARGE: "1rem",
  XLARGE: "1.2rem",
  XXLARGE: "1.5rem",
} as const;
