import { useState, useEffect, useCallback } from "react";
import { Booking } from "../types/booking";
import { BookingService } from "../services/bookingService";

export const useBookings = () => {
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookingsForDate = useCallback(async (startDate: Date | null) => {
    if (!startDate) {
      setSelectedBookings([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Get bookings for the specific selected time (not a 24-hour range)
      const bookings = await BookingService.getBookingsForDateTime(startDate);
      // Filter out CONFIRMED bookings - only show PENDING and CANCELLED bookings
      const filteredBookings = bookings.filter(booking => booking.status !== "CONFIRMED");
      setSelectedBookings(filteredBookings);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings");
      setSelectedBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllFreeBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bookings = await BookingService.getAllFreeBookings();
      setAllBookings(bookings);
    } catch (err) {
      console.error("Error loading all free bookings:", err);
      setError("Failed to load available bookings");
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bookings = await BookingService.getAllBookings();
      console.log("Loaded my bookings:", bookings);
      setMyBookings(bookings);
    } catch (err) {
      console.error("Error loading my bookings:", err);
      setError("Failed to load your bookings");
      setMyBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    selectedBookings,
    allBookings,
    myBookings,
    loading,
    error,
    loadBookingsForDate,
    loadAllFreeBookings,
    loadMyBookings,
    setSelectedBookings,
    setAllBookings,
    setMyBookings,
  };
};
