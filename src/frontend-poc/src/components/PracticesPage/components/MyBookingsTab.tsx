import React from "react";
import { MyBookingsTabProps } from "../../../types/bookingComponents";
import BookingCard from "./BookingCard";
import { isUserBooking, hasUserResponded } from "../../../utils/bookingUtils";

const MyBookingsTab: React.FC<MyBookingsTabProps> = ({
  myBookings,
  currentUsername,
  onAcceptBookingResponse,
  onDeclineBookingResponse,
  onWithdrawAcceptance,
  onDeleteBooking,
  onWithdrawBookingResponse,
  formatDateTime,
  getStatusColor,
  isUserBooking: isUserBookingProp,
  hasUserResponded: hasUserRespondedProp,
}) => {
  // Filter out bookings where user withdrew their response
  // Only show bookings where user is the creator OR has an active response
  const activeBookings = myBookings
    .filter((booking) => {
      // Always show bookings the user created
      if (isUserBooking(booking, currentUsername)) {
        console.log("✅ Showing booking - user is creator");
        return true;
      }

      // Only show bookings where user has an active response (not withdrawn)
      const hasResponded = hasUserResponded(booking, currentUsername);
      console.log("Has user responded:", hasResponded);
      if (hasResponded) {
        console.log("✅ Showing booking - user has responded");
      } else {
        console.log("❌ Hiding booking - user has not responded");
      }
      return hasResponded;
    })
    .sort((a, b) => {
      // Sort by booking time (earliest first)
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  return (
    <div className="bookings-section">
      <h3
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "1.5rem",
        }}
      >
        My Bookings
      </h3>

      {/* My Bookings List */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontSize: "1.2rem",
          }}
        >
          Your bookings:
        </h4>

        {activeBookings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#6c757d",
              fontStyle: "italic",
            }}
          >
            No active bookings found
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {activeBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                currentUsername={currentUsername}
                onAcceptBookingResponse={onAcceptBookingResponse}
                onDeclineBookingResponse={onDeclineBookingResponse}
                onWithdrawAcceptance={onWithdrawAcceptance}
                onDeleteBooking={onDeleteBooking}
                onWithdrawBookingResponse={onWithdrawBookingResponse}
                formatDateTime={formatDateTime}
                getStatusColor={getStatusColor}
                isUserBooking={isUserBookingProp}
                hasUserResponded={hasUserRespondedProp}
              />
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // This will be handled by the parent component
          }}
          className="mobile-button"
          style={{
            backgroundColor: "#6c757d",
            color: "white",
          }}
        >
          Back to Join Call
        </button>
      </div>
    </div>
  );
};

export default MyBookingsTab;
