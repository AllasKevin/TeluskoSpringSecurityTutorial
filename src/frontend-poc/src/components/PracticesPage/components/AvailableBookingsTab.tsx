import React from "react";
import { AvailableBookingsTabProps } from "../../../types/bookingComponents";
import BookingCard from "./BookingCard";
import "./BookingsTab.css";

const AvailableBookingsTab: React.FC<AvailableBookingsTabProps> = ({
  availableBookings,
  currentUsername,
  onRespondToBooking,
  onAcceptBookingResponse,
  onDeclineBookingResponse,
  onWithdrawAcceptance,
  onDeleteBooking,
  onWithdrawBookingResponse,
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
  setShowPopup,
  currentBooking,
  setCurrentBooking,
}) => {
  // Filter out bookings where the current user is the initial booker
  availableBookings = availableBookings.filter(
    (booking) => !isUserBooking(booking)
  );

  return (
    <div className="bookings-section">
      <h3>Available Bookings</h3>

      {/* All Free Bookings List */}
      <div className="bookings-list-container">
        <h4>Pending bookings from other users:</h4>

        {availableBookings.length === 0 ? (
          <div className="bookings-empty-message">No bookings found</div>
        ) : (
          <div className="bookings-list">
            {availableBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                currentUsername={currentUsername}
                onRespondToBooking={onRespondToBooking}
                onAcceptBookingResponse={onAcceptBookingResponse}
                onDeclineBookingResponse={onDeclineBookingResponse}
                onWithdrawAcceptance={onWithdrawAcceptance}
                onDeleteBooking={onDeleteBooking}
                onWithdrawBookingResponse={onWithdrawBookingResponse}
                formatDateTime={formatDateTime}
                getStatusColor={getStatusColor}
                isUserBooking={isUserBooking}
                hasUserResponded={hasUserResponded}
                setShowPopup={setShowPopup}
                currentBooking={currentBooking}
                setCurrentBooking={setCurrentBooking}
              />
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="bookings-back-button-container">
        <button
          onClick={(e) => {
            e.stopPropagation();
            // This will be handled by the parent component
          }}
          className="mobile-button bookings-back-button"
        >
          Back to Join Call
        </button>
      </div>
    </div>
  );
};

export default AvailableBookingsTab;
