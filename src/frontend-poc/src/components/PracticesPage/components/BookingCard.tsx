import React from "react";
import { BookingCardProps } from "../../../types/bookingComponents";
import {
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
  getUserRoleText,
  getUserRoleColor,
  isBookingReady,
  getTimeUntilBooking,
} from "../../../utils/bookingUtils";

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  currentUsername,
  onBookingAction,
  onRespondToBooking,
  onAcceptBookingResponse,
  onDeclineBookingResponse,
  onWithdrawAcceptance,
  onDeleteBooking,
  onWithdrawBookingResponse,
}) => {
  const isUser = isUserBooking(booking, currentUsername);
  const hasResponded = hasUserResponded(booking, currentUsername);

  const handleReadyForCall = () => {
    // TODO: Implement join call functionality
    console.log("Ready for call clicked for booking:");
    console.log(booking);
  };

  const renderActionButtons = () => {
    // Handle confirmed bookings first
    if (booking.status === "CONFIRMED") {
      if (isUser) {
        // User's own confirmed booking
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                color: "#28a745",
                fontWeight: "bold",
                marginTop: "8px",
                padding: "8px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "4px",
              }}
            >
              ✅ Call confirmed! Your session with{" "}
              {booking.responses?.[0]?.responder.username ||
                "the other participant"}{" "}
              will take place at {formatDateTime(booking.dateTime)}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  border: "1px solid #dee2e6",
                }}
              >
                <span style={{ fontWeight: "500" }}>
                  {booking.responses?.[0]?.responder.username || "Unknown User"}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  {isBookingReady(booking.dateTime) ? (
                    <button
                      onClick={() => {
                        handleReadyForCall;
                      }}
                      className="action-button ready"
                      style={{
                        fontSize: "0.7rem",
                        padding: "4px 8px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        width: "auto",
                        minWidth: "60px",
                      }}
                    >
                      Ready
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#6c757d",
                        fontStyle: "italic",
                      }}
                    >
                      {getTimeUntilBooking(booking.dateTime)}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      console.log("=== WITHDRAW ACCEPTANCE BUTTON CLICKED ===");
                      console.log("Booking ID:", booking.id);
                      console.log("Booking object:", booking);
                      console.log(
                        "onWithdrawAcceptance function:",
                        onWithdrawAcceptance
                      );
                      onWithdrawAcceptance?.(booking.id);
                    }}
                    className="action-button withdraw"
                    style={{
                      fontSize: "0.7rem",
                      padding: "4px 8px",
                      backgroundColor: "#ffc107",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      width: "auto",
                      minWidth: "80px",
                      maxWidth: "120px",
                    }}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
              <button
                onClick={() => onDeleteBooking?.(booking.id)}
                className="action-button delete"
                style={{
                  fontSize: "0.8rem",
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  width: "100%",
                }}
              >
                Delete Booking
              </button>
            </div>
          </div>
        );
      } else if (hasResponded) {
        // User responded to someone else's confirmed booking
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                color: "#28a745",
                fontWeight: "bold",
                marginTop: "8px",
                padding: "8px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "4px",
              }}
            >
              ✅ Call confirmed! Your session with {booking.userName} will take
              place at {formatDateTime(booking.dateTime)}
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              {isBookingReady(booking.dateTime) ? (
                <button
                  onClick={() => {
                    handleReadyForCall();
                  }}
                  className="action-button ready"
                  style={{
                    fontSize: "0.8rem",
                    padding: "4px 8px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    width: "auto",
                    minWidth: "60px",
                  }}
                >
                  Ready
                </button>
              ) : (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#6c757d",
                    fontStyle: "italic",
                  }}
                >
                  {getTimeUntilBooking(booking.dateTime)}
                </span>
              )}
              <button
                onClick={() => onWithdrawBookingResponse?.(booking.id)}
                className="action-button withdraw"
                style={{
                  fontSize: "0.8rem",
                  padding: "4px 8px",
                  backgroundColor: "#6c757d",
                  color: "white",
                }}
              >
                Withdraw Response
              </button>
            </div>
          </div>
        );
      }
    }

    // Handle pending bookings
    if (booking.status === "PENDING") {
      if (isUser) {
        // User's own pending booking
        const hasNonDeclinedResponses = booking.responses?.some(
          (response) => response.responseStatus !== "DECLINED"
        );

        if (hasNonDeclinedResponses) {
          // Show list of responders with accept/decline buttons
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#ffc107",
                  fontWeight: "bold",
                }}
              >
                ⏳ Waiting for responses
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {booking.responses
                  ?.filter((response) => response.responseStatus !== "DECLINED")
                  .map((response, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>
                        {response.responder.username}
                      </span>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={() => {
                            onAcceptBookingResponse?.(
                              booking.id,
                              response.responder.username
                            );
                          }}
                          className="action-button accept"
                          style={{
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            onDeclineBookingResponse?.(
                              booking.id,
                              response.responder.username
                            );
                          }}
                          className="action-button decline"
                          style={{
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => onDeleteBooking?.(booking.id)}
                className="action-button delete"
                style={{
                  fontSize: "0.8rem",
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  width: "100%",
                }}
              >
                Delete Booking
              </button>
            </div>
          );
        } else {
          // No responses yet
          return (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#ffc107",
                  fontWeight: "bold",
                }}
              >
                ⏳ Waiting for responses
              </div>
              <button
                onClick={() => onDeleteBooking?.(booking.id)}
                className="action-button delete"
                style={{
                  fontSize: "0.8rem",
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  width: "100%",
                }}
              >
                Delete Booking
              </button>
            </div>
          );
        }
      } else if (hasResponded) {
        // User responded to someone else's pending booking
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                fontSize: "0.9rem",
                color: "#28a745",
                fontWeight: "bold",
                marginTop: "8px",
                padding: "8px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "4px",
              }}
            >
              ✓ Your response sent
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6c757d",
                fontStyle: "italic",
              }}
            >
              Waiting for {booking.userName} to accept your response
            </div>
            <button
              onClick={() => onWithdrawBookingResponse?.(booking.id)}
              className="action-button withdraw"
              style={{
                fontSize: "0.8rem",
                padding: "4px 8px",
                backgroundColor: "#6c757d",
                color: "white",
                marginTop: "8px",
              }}
            >
              Withdraw Response
            </button>
          </div>
        );
      } else {
        // User can respond to someone else's pending booking
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => onRespondToBooking?.(booking.id)}
              className="action-button respond"
              style={{
                fontSize: "0.8rem",
                padding: "6px 12px",
                backgroundColor: "#007bff",
                color: "white",
                width: "100%",
              }}
            >
              Respond to Booking
            </button>
          </div>
        );
      }
    }

    return null;
  };

  const renderUserInfo = () => {
    const roleText = getUserRoleText(isUser, hasResponded);
    const roleColor = getUserRoleColor(isUser, hasResponded);

    return (
      <div
        style={{
          fontSize: "0.8rem",
          color: roleColor,
          fontWeight: "500",
          marginBottom: "4px",
        }}
      >
        {roleText}
      </div>
    );
  };

  return (
    <div
      className="booking-card"
      style={{
        border: "2px solid #6f42c1",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem" }}>
            {booking.userName}
          </h3>
          <p style={{ margin: "0 0 4px 0", color: "#666", fontSize: "0.9rem" }}>
            {booking.practice}
          </p>
          <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "0.9rem" }}>
            {formatDateTime(booking.dateTime)}
          </p>
          {renderUserInfo()}
        </div>
        <div
          style={{
            backgroundColor: getStatusColor(booking.status),
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          {booking.status}
        </div>
      </div>
      {renderActionButtons()}
    </div>
  );
};

export default BookingCard;
