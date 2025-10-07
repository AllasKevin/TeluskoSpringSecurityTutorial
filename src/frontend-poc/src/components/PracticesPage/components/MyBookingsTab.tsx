import React from "react";
import { MyBookingsTabProps } from "../../../types/bookingComponents";
import BookingCard from "./BookingCard";

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
  isUserBooking,
  hasUserResponded,
}) => {
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

        {myBookings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#6c757d",
              fontStyle: "italic",
            }}
          >
            No bookings found
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {myBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                currentUsername={currentUsername}
                tabType="mybookings"
                onAcceptBookingResponse={onAcceptBookingResponse}
                onDeclineBookingResponse={onDeclineBookingResponse}
                onWithdrawAcceptance={onWithdrawAcceptance}
                onDeleteBooking={onDeleteBooking}
                onWithdrawBookingResponse={onWithdrawBookingResponse}
                formatDateTime={formatDateTime}
                getStatusColor={getStatusColor}
                isUserBooking={isUserBooking}
                hasUserResponded={hasUserResponded}
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
