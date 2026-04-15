import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Booking } from '../../types/booking';
import { formatDateTime, getStatusColor } from '../../utils/bookingUtils';
import { BookingService } from '../../services/bookingService';
import './BookingReminder.css';

export interface BookingReminderNewHandle {
  checkForUpcomingBookings: () => Promise<void>;
}

interface BookingReminderProps {
  currentUsername: string | null;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenPractice: React.Dispatch<React.SetStateAction<string>>;
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
  currentBooking: Booking | undefined;
}

const REMINDER_WINDOW_MINUTES = 5;

const BookingReminder = forwardRef<BookingReminderNewHandle, BookingReminderProps>(
  ({ currentUsername, setShowPopup, setChosenPractice, setCurrentBooking, currentBooking }, ref) => {
    const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const checkForUpcomingBookings = async () => {
      try {
        const bookings = await BookingService.getAllBookings();
        const now = new Date();

        const upcoming = bookings.find((booking: Booking) => {
          if (booking.status !== 'CONFIRMED') return false;

          const isUserInvolved =
            booking.userName === currentUsername ||
            booking.responses?.some(
              (response) =>
                response.responder.username === currentUsername &&
                response.responseStatus === 'ACCEPTED',
            );

          if (!isUserInvolved) return false;

          const bookingTime = new Date(booking.dateTime);
          const timeDiff = bookingTime.getTime() - now.getTime();
          const minutesDiff = timeDiff / (1000 * 60);

          return minutesDiff <= REMINDER_WINDOW_MINUTES && minutesDiff >= 0;
        });

        if (upcoming) {
          setUpcomingBooking(upcoming);
          setIsVisible(true);
        }
      } catch {
        // Silently fail - reminders are non-critical
      }
    };

    useEffect(() => {
      if (!currentUsername) return;
      checkForUpcomingBookings();
    }, [currentUsername]);

    const handleClose = () => {
      setIsVisible(false);
      setUpcomingBooking(null);
    };

    const handleJoinCall = () => {
      setChosenPractice(upcomingBooking?.practice ?? '');
      setCurrentBooking(upcomingBooking ?? undefined);
      handleClose();
      setShowPopup(true);
    };

    useImperativeHandle(ref, () => ({
      checkForUpcomingBookings,
    }));

    if (!isVisible || !upcomingBooking) return null;

    const acceptedParticipants = upcomingBooking.responses
      ?.filter((r) => r.responseStatus === 'ACCEPTED')
      .map((r) => r.responder.username)
      .join(', ');

    return (
      <div className="booking-reminder-overlay">
        <div className="booking-reminder-dialog">
          <div className="booking-reminder-header">
            <h2 className="booking-reminder-title">
              {'\uD83C\uDFAF'} It's Time for Your Booking!
            </h2>
            <p className="booking-reminder-subtitle">
              Your confirmed booking is starting soon
            </p>
          </div>

          <div className="booking-reminder-card">
            <div className="booking-reminder-card-header">
              <div className="booking-reminder-card-name">{upcomingBooking.userName}</div>
              <div
                className="booking-reminder-status-badge"
                style={{ backgroundColor: getStatusColor(upcomingBooking.status) }}
              >
                {upcomingBooking.status}
              </div>
            </div>

            <div className="booking-reminder-detail">
              <strong>Practice:</strong> {upcomingBooking.practice}
            </div>
            <div className="booking-reminder-detail">
              <strong>Time:</strong> {formatDateTime(upcomingBooking.dateTime)}
            </div>
            <div className="booking-reminder-detail">
              <strong>Booked by:</strong> {upcomingBooking.userName}
            </div>

            {acceptedParticipants && (
              <div className="booking-reminder-detail">
                <strong>Participant:</strong> {acceptedParticipants}
              </div>
            )}

            <div className="booking-reminder-confirmed-banner">
              {'\u2705'} Call confirmed! Your session will take place at the booked time.
            </div>
          </div>

          <div className="booking-reminder-actions">
            <button onClick={handleJoinCall} className="booking-reminder-join-btn">
              Join Call
            </button>
            <button onClick={handleClose} className="booking-reminder-dismiss-btn">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default BookingReminder;
