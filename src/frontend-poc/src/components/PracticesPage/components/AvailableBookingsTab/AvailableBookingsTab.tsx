import React from 'react';
import { AvailableBookingsTabProps } from '../../../../types/bookingComponents';
import BookingCard from '../BookingCard';
import '../BookingsTab.css';

const AvailableBookingsTab: React.FC<AvailableBookingsTabProps> = ({
  practice,
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
  const filteredBookings = availableBookings
    .filter((booking) => !isUserBooking(booking))
    .filter((b) => b.practice === practice || practice === 'anypractice');

  return (
    <div className="bookings-section">
      <h3>Available Bookings</h3>

      <div className="bookings-list-container">
        <h4>Pending bookings from other users:</h4>

        {filteredBookings.length === 0 ? (
          <div className="bookings-empty-message">No bookings found</div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
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
    </div>
  );
};

export default AvailableBookingsTab;
