import React from "react";
import { BookingCardProps } from "../../../types/bookingComponents";
import {
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
  getUserRoleText,
  getUserRoleColor,
} from "../../../utils/bookingUtils";

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  currentUsername,
  tabType,
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

  const renderActionButtons = () => {
    if (tabType === "schedule") {
      // Schedule Call tab - show respond button only for other users' bookings
      if (booking.status === "PENDING" && !isUser) {
        return (
          <div className="action-buttons">
            {hasResponded ? (
              <div className="response-confirmation">
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#28a745",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  ✓ Your response sent
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#6c757d",
                  }}
                >
                  Waiting for {booking.userName} to accept your response
                </div>
                <button
                  onClick={() => {
                    console.log("=== WITHDRAW RESPONSE BUTTON CLICKED ===");
                    console.log("Booking ID:", booking.id);
                    console.log("Booking object:", booking);
                    console.log(
                      "onWithdrawBookingResponse function:",
                      onWithdrawBookingResponse
                    );
                    onWithdrawBookingResponse?.(booking.id);
                  }}
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
            ) : (
              <button
                onClick={() => onRespondToBooking?.(booking.id)}
                className="action-button respond"
              >
                Respond to Booking
              </button>
            )}
          </div>
        );
      } else if (isUser) {
        // User's own bookings - show waiting for responses and delete button
        const hasResponses =
          booking.responses &&
          booking.responses.filter(
            (response) => response.responseStatus !== "DECLINED"
          ).length > 0;
        return (
          <div className="responses-section">
            {hasResponses && booking.status !== "CONFIRMED" ? (
              <>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {booking.responses?.filter(
                    (response) => response.responseStatus !== "DECLINED"
                  ).length || 0}{" "}
                  response
                  {(booking.responses?.filter(
                    (response) => response.responseStatus !== "DECLINED"
                  ).length || 0) > 1
                    ? "s"
                    : ""}{" "}
                  received
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {booking.responses
                    ?.filter(
                      (response) => response.responseStatus !== "DECLINED"
                    )
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
                        {booking.status === "PENDING" && (
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
                        )}
                      </div>
                    ))}
                </div>
              </>
            ) : booking.status !== "CONFIRMED" ? (
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
            ) : null}
            {booking.status === "CONFIRMED" && (
              <>
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
                      {booking.responses?.[0]?.responder.username ||
                        "Unknown User"}
                    </span>
                    <button
                      onClick={() => {
                        console.log(
                          "=== WITHDRAW ACCEPTANCE BUTTON CLICKED ==="
                        );
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
              </>
            )}
          </div>
        );
      }
      return null;
    }

    if (tabType === "available") {
      // Available Bookings tab - show respond button or confirmation
      if (booking.status === "PENDING" && !isUser) {
        return (
          <div className="action-buttons">
            {hasResponded ? (
              <div className="response-confirmation">
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#28a745",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  ✓ Your response sent
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#6c757d",
                  }}
                >
                  Waiting for {booking.userName} to accept your response
                </div>
                <button
                  onClick={() => {
                    console.log("=== WITHDRAW RESPONSE BUTTON CLICKED ===");
                    console.log("Booking ID:", booking.id);
                    console.log("Booking object:", booking);
                    console.log(
                      "onWithdrawBookingResponse function:",
                      onWithdrawBookingResponse
                    );
                    onWithdrawBookingResponse?.(booking.id);
                  }}
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
            ) : (
              <button
                onClick={() => onRespondToBooking?.(booking.id)}
                className="action-button respond"
              >
                Respond to Booking
              </button>
            )}
          </div>
        );
      } else if (isUser) {
        // User's own bookings - show waiting for responses and delete button
        const hasResponses =
          booking.responses &&
          booking.responses.filter(
            (response) => response.responseStatus !== "DECLINED"
          ).length > 0;
        return (
          <div className="responses-section">
            {hasResponses && booking.status !== "CONFIRMED" ? (
              <>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {booking.responses?.filter(
                    (response) => response.responseStatus !== "DECLINED"
                  ).length || 0}{" "}
                  response
                  {(booking.responses?.filter(
                    (response) => response.responseStatus !== "DECLINED"
                  ).length || 0) > 1
                    ? "s"
                    : ""}{" "}
                  received
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {booking.responses
                    ?.filter(
                      (response) => response.responseStatus !== "DECLINED"
                    )
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
                        {booking.status === "PENDING" && (
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
                        )}
                      </div>
                    ))}
                </div>
              </>
            ) : booking.status !== "CONFIRMED" ? (
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
            ) : null}
            {booking.status === "CONFIRMED" && (
              <>
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
                      {booking.responses?.[0]?.responder.username ||
                        "Unknown User"}
                    </span>
                    <button
                      onClick={() => {
                        console.log(
                          "=== WITHDRAW ACCEPTANCE BUTTON CLICKED ==="
                        );
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
              </>
            )}
          </div>
        );
      }
      return null;
    }

    if (tabType === "mybookings") {
      // My Bookings tab - show different content based on user role
      if (isUser) {
        // User's own bookings
        const hasResponses =
          booking.responses &&
          booking.responses.filter(
            (response) => response.responseStatus !== "DECLINED"
          ).length > 0;

        return (
          <div className="responses-section">
            {hasResponses && booking.status !== "CONFIRMED" ? (
              <>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {booking.responses?.filter(
                    (response) => response.responseStatus !== "DECLINED"
                  ).length || 0}{" "}
                  response
                  {(booking.responses?.filter(
                    (response) => response.responseStatus !== "DECLINED"
                  ).length || 0) > 1
                    ? "s"
                    : ""}{" "}
                  received
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {booking.responses
                    ?.filter(
                      (response) => response.responseStatus !== "DECLINED"
                    )
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
                        {booking.status === "PENDING" && (
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
                        )}
                      </div>
                    ))}
                </div>
              </>
            ) : booking.status !== "CONFIRMED" ? (
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
            ) : null}
            {booking.status === "CONFIRMED" && (
              <>
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
                      {booking.responses?.[0]?.responder.username ||
                        "Unknown User"}
                    </span>
                    <button
                      onClick={() => {
                        console.log(
                          "=== WITHDRAW ACCEPTANCE BUTTON CLICKED ==="
                        );
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
              </>
            )}
          </div>
        );
      } else if (hasResponded) {
        // User responded to this booking
        return (
          <div className="response-confirmation">
            {booking.status !== "CONFIRMED" && (
              <>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#28a745",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  ✓ Your response sent
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#6c757d",
                  }}
                >
                  Waiting for {booking.userName} to accept your response
                </div>
              </>
            )}
            {booking.status === "CONFIRMED" && (
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
                ✅ Call confirmed! Your session with {booking.userName} will
                take place at {formatDateTime(booking.dateTime)}
              </div>
            )}
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
      }
    }

    return null;
  };

  const renderUserInfo = () => {
    const roleText = getUserRoleText(isUser, hasResponded);
    const roleColor = getUserRoleColor(isUser, hasResponded);

    return (
      <div
        className="user-booking-info"
        style={{ marginTop: "8px", marginBottom: "8px" }}
      >
        <span
          style={{
            fontSize: "0.9rem",
            color: roleColor,
            fontWeight: "bold",
            fontStyle: "italic",
          }}
        >
          {roleText}
        </span>
      </div>
    );
  };

  return (
    <div className="booking-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <strong style={{ fontSize: "1.1rem" }}>{booking.userName}</strong>
          <div
            style={{
              fontSize: "0.9rem",
              color: "#6c757d",
            }}
          >
            {booking.practice}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6c757d",
              marginTop: "4px",
            }}
          >
            {formatDateTime(booking.dateTime)}
          </div>
        </div>
        <span
          className="status-badge"
          style={{
            backgroundColor: getStatusColor(booking.status),
          }}
        >
          {booking.status}
        </span>
      </div>

      {renderUserInfo()}
      {renderActionButtons()}
    </div>
  );
};

export default BookingCard;
