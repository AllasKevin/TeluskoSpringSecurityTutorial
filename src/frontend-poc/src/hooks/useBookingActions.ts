import { useState, useCallback } from "react";
import { Booking } from "../types/booking";
import { BookingService } from "../services/bookingService";

export const useBookingActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const respondToBooking = useCallback(async (
    bookingId: string,
    bookingData: Booking,
    onSuccess?: (updatedBooking: Booking) => void
  ) => {
    setIsProcessing(true);
    try {
      const updatedBooking = await BookingService.updateBookingStatus(
        bookingId,
        "pending",
        bookingData
      );
      onSuccess?.(updatedBooking);
      return updatedBooking;
    } catch (error) {
      console.error("Error responding to booking:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const acceptBookingResponse = useCallback(async (
    bookingId: string,
    responderUsername: string,
    bookingData: Booking,
    onSuccess?: (updatedBooking: Booking) => void
  ) => {
    setIsProcessing(true);
    try {
      const updatedBooking = await BookingService.acceptBookingResponse(
        bookingId,
        responderUsername,
        bookingData
      );
      onSuccess?.(updatedBooking);
      return updatedBooking;
    } catch (error) {
      console.error("Error accepting booking response:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const createBooking = useCallback(async (
    dateTime: Date,
    practice: string,
    onSuccess?: (newBooking: Booking) => void
  ) => {
    setIsProcessing(true);
    try {
      const bookingData = {
        userName: "Current User", // TODO: Get from auth context
        dateTime: dateTime,
        practice: practice,
        status: "PENDING" as const,
      };
      const newBooking = await BookingService.createBooking(bookingData);
      onSuccess?.(newBooking);
      return newBooking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const deleteBooking = useCallback(async (
    bookingId: string,
    bookingData?: Booking,
    onSuccess?: () => void
  ) => {
    setIsProcessing(true);
    try {
      await BookingService.deleteBooking(bookingId, bookingData);
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const withdrawBookingResponse = useCallback(async (
    bookingId: string,
    bookingData?: Booking,
    onSuccess?: (updatedBooking: Booking) => void
  ) => {
    setIsProcessing(true);
    try {
      if (!bookingData) {
        throw new Error('Booking data is required for withdraw response');
      }
      const updatedBooking = await BookingService.withdrawBookingResponse(bookingId, bookingData);
      onSuccess?.(updatedBooking);
      return updatedBooking;
    } catch (error) {
      console.error("Error withdrawing booking response:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const declineBookingResponse = useCallback(async (
    bookingId: string,
    declinedResponderUsername: string,
    bookingData: Booking,
    onSuccess?: (updatedBooking: Booking) => void
  ) => {
    setIsProcessing(true);
    try {
      const updatedBooking = await BookingService.declineBookingResponse(bookingId, declinedResponderUsername, bookingData);
      onSuccess?.(updatedBooking);
      return updatedBooking;
    } catch (error) {
      console.error("Error declining booking response:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const withdrawAcceptance = useCallback(async (
    bookingId: string,
    bookingData: Booking,
    onSuccess?: (updatedBooking: Booking) => void
  ) => {
    setIsProcessing(true);
    try {
      const updatedBooking = await BookingService.withdrawAcceptance(bookingId, bookingData);
      onSuccess?.(updatedBooking);
      return updatedBooking;
    } catch (error) {
      console.error("Error withdrawing acceptance:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    respondToBooking,
    acceptBookingResponse,
    createBooking,
    deleteBooking,
    withdrawBookingResponse,
    declineBookingResponse,
    withdrawAcceptance,
  };
};
