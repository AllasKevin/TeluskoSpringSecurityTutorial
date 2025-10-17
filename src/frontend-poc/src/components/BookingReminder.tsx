import React, { useState, useEffect } from "react";
import { Booking } from "../types/booking";
import { formatDateTime, getStatusColor } from "../utils/bookingUtils";
import { BookingService } from "../services/bookingService";

interface BookingReminderProps {
  currentUsername: string | null;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenPractice: React.Dispatch<React.SetStateAction<string>>; // TODO denna används nig aldrig och kan tas bort
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
  currentBooking: Booking | undefined;
}

const BookingReminder: React.FC<BookingReminderProps> = ({
  currentUsername,
  setShowPopup,
  setChosenPractice,
  setCurrentBooking,
  currentBooking,
}) => {
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!currentUsername) {
      return;
    }

    let intervalId: number;

    const checkForUpcomingBookings = async () => {
      try {
        // Get all user's bookings (both as initial booker and responder)
        const bookings = await BookingService.getAllBookings();

        // Find confirmed bookings within 15 minutes
        const now = new Date();
        const upcoming = bookings.find((booking: Booking) => {
          if (booking.status !== "CONFIRMED") {
            return false;
          }

          // Check if current user is involved in this booking
          const isUserInvolved =
            booking.userName === currentUsername || // User is the initial booker
            booking.responses?.some(
              (response) =>
                response.responder.username === currentUsername &&
                response.responseStatus === "ACCEPTED"
            ); // User is an accepted responder

          if (!isUserInvolved) {
            return false;
          }

          const bookingTime = new Date(booking.dateTime);
          const timeDiff = bookingTime.getTime() - now.getTime();
          const minutesDiff = timeDiff / (1000 * 60);

          // Within 15 minutes and not past the booking time
          const isUpcoming = minutesDiff <= 15 && minutesDiff >= 0;

          return isUpcoming;
        });

        if (upcoming) {
          setUpcomingBooking(upcoming);
          setIsVisible(true);
          // Stop polling once we found an upcoming booking
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error checking for upcoming bookings:", error);
      }
    };

    // Check immediately
    checkForUpcomingBookings();

    // Poll every 30 seconds for responsive detection
    intervalId = setInterval(checkForUpcomingBookings, 10000);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUsername]);

  const handleClose = () => {
    setIsVisible(false);
    setUpcomingBooking(null);
  };

  const handleJoinCall = () => {
    // TODO: Implement join call functionality
    setChosenPractice(upcomingBooking?.practice || "");
    setCurrentBooking(upcomingBooking || undefined);
    handleClose();
    setShowPopup(true);
  };

  if (!isVisible || !upcomingBooking) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            borderBottom: "2px solid #007bff",
            paddingBottom: "15px",
          }}
        >
          <h2
            style={{
              color: "#007bff",
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            🎯 It's Time for Your Booking!
          </h2>
          <p
            style={{
              color: "#6c757d",
              margin: "8px 0 0 0",
              fontSize: "1rem",
            }}
          >
            Your confirmed booking is starting soon
          </p>
        </div>

        {/* Booking Card */}
        <div
          style={{
            border: "2px solid #28a745",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                color: "#333",
              }}
            >
              {upcomingBooking.userName}
            </div>
            <div
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                backgroundColor: getStatusColor(upcomingBooking.status),
                color: "white",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              {upcomingBooking.status}
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>Practice:</strong> {upcomingBooking.practice}
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>Time:</strong> {formatDateTime(upcomingBooking.dateTime)}
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>Booked by:</strong> {upcomingBooking.userName}
          </div>

          {/* Show participant info for confirmed bookings */}
          {upcomingBooking.status === "CONFIRMED" &&
            upcomingBooking.responses &&
            upcomingBooking.responses.length > 0 && (
              <div style={{ marginBottom: "8px" }}>
                <strong>Participant:</strong>{" "}
                {upcomingBooking.responses
                  .filter((response) => response.responseStatus === "ACCEPTED")
                  .map((response) => response.responder.username)
                  .join(", ")}
              </div>
            )}

          <div
            style={{
              textAlign: "center",
              padding: "12px",
              backgroundColor: "#d4edda",
              borderRadius: "6px",
              color: "#155724",
              fontWeight: "bold",
              marginTop: "12px",
            }}
          >
            ✅ Call confirmed! Your session will take place at the booked time.
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleJoinCall}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: "120px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#218838";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#28a745";
            }}
          >
            Join Call
          </button>

          <button
            onClick={handleClose}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: "120px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#5a6268";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#6c757d";
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReminder;
