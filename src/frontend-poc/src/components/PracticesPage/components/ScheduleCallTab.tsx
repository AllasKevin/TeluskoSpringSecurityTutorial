import React from "react";
import { ScheduleCallTabProps } from "../../../types/bookingComponents";
import BookingCard from "./BookingCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleCallTab: React.FC<ScheduleCallTabProps> = ({
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
}) => {
  return (
    <div className="scheduler-section">
      <h3
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "1.5rem",
        }}
      >
        Schedule Call
      </h3>

      {/* Mobile-friendly DatePicker */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
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
        <div
          style={{
            marginBottom: "20px",
            padding: "12px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <strong>Selected: {formatDateTime(startDate)}</strong>
        </div>
      )}

      {/* Bookings List */}
      {startDate && (
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              textAlign: "center",
              marginBottom: "15px",
              fontSize: "1.2rem",
            }}
          >
            Available bookings for selected time:
          </h4>

          {selectedBookings.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#6c757d",
                fontStyle: "italic",
              }}
            >
              No bookings found for this time
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {selectedBookings.map((booking) => (
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
                />
              ))}
            </div>
          )}

          {/* Create New Booking Button */}
          {startDate && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                onClick={onCreateBooking}
                className="mobile-button"
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  minHeight: "48px",
                  minWidth: "200px",
                }}
              >
                Create New Booking
              </button>
            </div>
          )}

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
      )}
    </div>
  );
};

export default ScheduleCallTab;
