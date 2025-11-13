import React from "react";
import { MyBookingsTabProps } from "../../../types/bookingComponents";
import BookingCard from "./BookingCard";
import { isUserBooking, hasUserResponded } from "../../../utils/bookingUtils";
import "./BookingsTab.css";

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
  setShowPopup,
  currentBooking,
  setCurrentBooking,
}) => {
  // Filter out bookings where user withdrew their response
  // Only show bookings where user is the creator OR has an active response
  const activeBookings = myBookings
    .filter((booking) => {
      // Always show bookings the user created
      if (isUserBooking(booking, currentUsername)) {
        return true;
      }

      // Only show bookings where user has an active response (not withdrawn)
      const hasResponded = hasUserResponded(booking, currentUsername);

      return hasResponded;
    })
    .sort((a, b) => {
      // Sort by booking time (earliest first)
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  return (
    <div className="bookings-section">
      <h3>My Bookings</h3>

      {/* My Bookings List */}
      <div className="bookings-list-container">
        <h4>Your bookings:</h4>

        {activeBookings.length === 0 ? (
          <div className="bookings-empty-message">
            No active bookings found
          </div>
        ) : (
          <div className="bookings-list">
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

export default MyBookingsTab;
