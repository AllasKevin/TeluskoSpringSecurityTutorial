import React, { useState } from 'react';
import { BookingCardProps } from '../../../../types/bookingComponents';
import {
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
  getUserRoleText,
  getUserRoleColor,
  isBookingReady,
  getTimeUntilBooking,
} from '../../../../utils/bookingUtils';
import './BookingCard.css';

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
  setShowPopup,
  currentBooking,
  setCurrentBooking,
}) => {
  const isUser = isUserBooking(booking, currentUsername);
  const hasResponded = hasUserResponded(booking, currentUsername);
  const [accepterUsername, setAcceptedUsername] = useState<string | null>(null);

  const handleReadyForCall = () => {
    setCurrentBooking(booking);
    setShowPopup(true);
  };

  const renderConfirmedBookerActions = () => (
    <div className="booking-actions">
      <div className="confirmed-message">
        {'\u2705'} Call confirmed! Your session with{' '}
        {booking.responses?.[0]?.responder.username ?? 'the other participant'}{' '}
        will take place at {formatDateTime(booking.dateTime)}
      </div>
      <div className="booking-actions">
        <div className="responder-item">
          <span className="responder-name">
            {booking.responses?.[0]?.responder.username ?? 'Unknown User'}
          </span>
          <div className="responder-actions">
            {isBookingReady(booking.dateTime) ? (
              <button onClick={handleReadyForCall} className="action-button ready">
                Ready
              </button>
            ) : (
              <span className="time-info">{getTimeUntilBooking(booking.dateTime)}</span>
            )}
            <button
              onClick={() => {
                onWithdrawAcceptance?.(booking.id);
                setAcceptedUsername(null);
              }}
              className="action-button withdraw"
            >
              Withdraw
            </button>
          </div>
        </div>
        <button
          onClick={() => onDeleteBooking?.(booking.id)}
          className="action-button delete-large"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );

  const renderConfirmedResponderActions = () => (
    <div className="booking-actions">
      <div className="confirmed-message">
        {'\u2705'} Call confirmed! Your session with {booking.userName} will take
        place at {formatDateTime(booking.dateTime)}
      </div>
      <div className="booking-actions-horizontal">
        {isBookingReady(booking.dateTime) ? (
          <button onClick={handleReadyForCall} className="action-button ready-large">
            Ready
          </button>
        ) : (
          <span className="time-info">{getTimeUntilBooking(booking.dateTime)}</span>
        )}
        <button
          onClick={() => onWithdrawBookingResponse?.(booking.id)}
          className="action-button secondary"
        >
          Withdraw Response
        </button>
      </div>
    </div>
  );

  const renderPendingOwnerWithResponses = () => {
    const nonDeclinedResponses = booking.responses?.filter(
      (response) => response.responseStatus !== 'DECLINED',
    );

    return (
      <div className="booking-actions">
        <div className="status-message warning">
          {'\uD83D\uDCCB'} Responses received - Choose who to accept
        </div>
        <div className="responder-list">
          {nonDeclinedResponses?.map((response, index) => (
            <div key={index} className="responder-item">
              <span className="responder-name">{response.responder.username}</span>
              <div className="responder-actions">
                <button
                  onClick={() => {
                    onAcceptBookingResponse?.(booking.id, response.responder.username);
                    setAcceptedUsername(response.responder.username);
                  }}
                  className="action-button accept"
                >
                  Accept
                </button>
                <button
                  onClick={() => onDeclineBookingResponse?.(booking.id, response.responder.username)}
                  className="action-button decline"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onDeleteBooking?.(booking.id)}
          className="action-button delete-large"
        >
          Cancel Booking
        </button>
      </div>
    );
  };

  const renderPendingOwnerNoResponses = () => (
    <div className="booking-actions">
      <div className="status-message warning">{'\u23F3'} Waiting for responses</div>
      <button
        onClick={() => onDeleteBooking?.(booking.id)}
        className="action-button delete-large"
      >
        Cancel Booking
      </button>
    </div>
  );

  const renderPendingRespondedActions = () => (
    <div className="booking-actions">
      <div className="status-message success">{'\u2713'} Your response sent</div>
      <div className="status-message info italic">
        Waiting for {booking.userName} to accept your response
      </div>
      <button
        onClick={() => onWithdrawBookingResponse?.(booking.id)}
        className="action-button secondary"
      >
        Withdraw Response
      </button>
    </div>
  );

  const renderActionButtons = () => {
    if (booking.status === 'CONFIRMED') {
      if (isUser) return renderConfirmedBookerActions();
      if (hasResponded) return renderConfirmedResponderActions();
    }

    if (booking.status === 'PENDING') {
      if (isUser) {
        const hasNonDeclinedResponses = booking.responses?.some(
          (r) => r.responseStatus !== 'DECLINED',
        );
        return hasNonDeclinedResponses
          ? renderPendingOwnerWithResponses()
          : renderPendingOwnerNoResponses();
      }

      if (hasResponded) return renderPendingRespondedActions();

      return (
        <div className="booking-actions">
          <button
            onClick={() => onRespondToBooking?.(booking.id)}
            className="action-button primary"
          >
            Respond to Booking
          </button>
        </div>
      );
    }

    return null;
  };

  const renderUserInfo = () => {
    const roleText = getUserRoleText(isUser, hasResponded);
    const roleColor = getUserRoleColor(isUser, hasResponded);

    if (!roleText) return null;

    return (
      <div
        className={`user-role ${isUser ? 'creator' : 'responder'}`}
        style={{ color: roleColor }}
      >
        {roleText}
      </div>
    );
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <div>
          <h3 className="booking-title">{booking.userName}</h3>
          <p className="booking-details">
            <span className="booking-detail-label">Practice:</span>
            <span className="booking-detail-value">{booking.practice}</span>
          </p>
          <p className="booking-details">
            <span className="booking-detail-label">Time:</span>
            <span className="booking-detail-value">{formatDateTime(booking.dateTime)}</span>
          </p>
          {renderUserInfo()}
        </div>
        <div className="booking-status" style={{ backgroundColor: getStatusColor(booking.status) }}>
          {booking.status}
        </div>
      </div>
      {renderActionButtons()}
    </div>
  );
};

export default BookingCard;
