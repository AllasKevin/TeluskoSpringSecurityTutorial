import React from 'react';
import { MyBookingsTabProps } from '../../../../types/bookingComponents';
import BookingCard from '../BookingCard';
import { isUserBooking, hasUserResponded } from '../../../../utils/bookingUtils';
import '../BookingsTab.css';

const MyBookingsTab: React.FC<MyBookingsTabProps> = ({
  practice,
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
  const activeBookings = myBookings
    .filter((booking) => {
      if (isUserBooking(booking, currentUsername)) return true;
      return hasUserResponded(booking, currentUsername);
    })
    .filter((b) => b.practice === practice || practice === 'anypractice')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div className="bookings-section">
      <h3>My Bookings</h3>

      <div className="bookings-list-container">
        <h4>Your bookings:</h4>

        {activeBookings.length === 0 ? (
          <div className="bookings-empty-message">No active bookings found</div>
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
    </div>
  );
};

export default MyBookingsTab;
