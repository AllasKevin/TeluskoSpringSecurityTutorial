import React, { useEffect } from "react";
import { ScheduleCallTabProps } from "../../../types/bookingComponents";
import BookingCard from "./BookingCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ScheduleCallTab.css";
import { all } from "axios";

const ScheduleCallTab: React.FC<ScheduleCallTabProps> = ({
  practice,
  selectedBookings,
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
  startDate,
  setStartDate,
  isMobile,
  onSearchBookings,
  onCreateBooking,
  setShowPopup,
  currentBooking,
  setCurrentBooking,
  allBookings,
}) => {
  return (
    <div className="scheduler-section">
      <h3>Schedule Call</h3>

      {/* Mobile-friendly DatePicker */}
      <div className="scheduler-datepicker-container">
        <label className="scheduler-datepicker-label">
          Select Date & Time:
        </label>
        <div className="custom-datepicker-wrapper">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMM d, yyyy HH:mm"
            placeholderText="Select date and time"
            withPortal={isMobile}
            popperPlacement={isMobile ? "bottom" : "bottom"}
            isClearable={false}
            className="mobile-datepicker"
            onFocus={(e) => {
              if (isMobile) {
                (e.target as HTMLInputElement).readOnly = true;
              }
            }}
            customInput={
              <div className="custom-date-input">
                <div className="date-display">
                  <div className="date-icon">📅</div>
                  <div className="date-content">
                    {startDate ? (
                      <>
                        <div className="selected-date">
                          {startDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="selected-time">
                          {startDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="placeholder-text">
                        Select date and time
                      </div>
                    )}
                  </div>
                  <div className="dropdown-arrow">▼</div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Selected Date/Time Display */}
      {startDate && (
        <div className="scheduler-selected-date-display">
          <strong>Selected: {formatDateTime(startDate)}</strong>
        </div>
      )}

      {/* Bookings List */}
      {startDate && (
        <div className="scheduler-bookings-container">
          <h4>Available bookings for selected time:</h4>

          {allBookings.filter(
            (b) =>
              startDate?.getTime() === new Date(b.dateTime).getTime() &&
              b.practice === practice
          ).length === 0 ? (
            <div className="scheduler-empty-message">
              No bookings found for this time
            </div>
          ) : (
            <div className="scheduler-bookings-list">
              {allBookings
                .filter(
                  (b) => startDate?.getTime() === new Date(b.dateTime).getTime()
                )
                .map((booking) => (
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

          {/* Create New Booking Button */}
          {startDate && (
            <div className="scheduler-create-button-container">
              <button
                onClick={onCreateBooking}
                className="mobile-button scheduler-create-button"
              >
                Create New Booking
              </button>
            </div>
          )}

          {/* Back Button */}
          <div className="scheduler-back-button-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // This will be handled by the parent component
              }}
              className="mobile-button scheduler-back-button"
            >
              Back to Join Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCallTab;
