import React, {
  RefObject,
  useRef,
  useState,
  useEffect,
  useRef as useReactRef,
} from "react";
import MandalaImage from "../../../assets/mandala.png";
import PlannerImage from "../../../assets/planner.png";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ScheduleCallSection.css";
import { CallStatus } from "../../../App";
import {
  WebRtcManager,
  WebRtcManagerNewHandle,
} from "../../WebRtcManager/WebRtcManager";
import { CallData } from "../../Dashboard";
import { Booking } from "../../../types/booking";
import { BookingService } from "../../../services/bookingService";

interface ScheduleCallSectionProps {
  practice: string; // Optional prop to pass the practice name
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >;
  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >;
  offerData: CallData | undefined;
  setOfferData: React.Dispatch<React.SetStateAction<any>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCallModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
}

export const ScheduleCallSection: React.FC<ScheduleCallSectionProps> = ({
  practice,
  callStatus,
  updateCallStatus,
  localStream,
  setLocalStream,
  remoteStream,
  setRemoteStream,
  peerConnection,
  setPeerConnection,
  offerData,
  setOfferData,
  remoteFeedEl,
  localFeedEl,
  gatheredAnswerIceCandidatesRef,
  setIceCandidatesReadyTrigger,
  remoteDescAddedForOfferer,
  setShowPopup,
  setShowCallModal,
  setRemoteDescAddedForOfferer,
  setAvailableCalls,
}) => {
  const [activeTab, setActiveTab] = useState<"join" | "schedule">("join"); // default is "join"
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter bookings for selected date/time
  useEffect(() => {
    const loadBookings = async () => {
      if (startDate) {
        try {
          const bookings = await BookingService.getBookingsForDateTime(
            startDate
          );
          setSelectedBookings(bookings);
        } catch (error) {
          console.error("Error loading bookings:", error);
          setSelectedBookings([]);
        }
      } else {
        setSelectedBookings([]);
      }
    };

    loadBookings();
  }, [startDate]);

  const handlePracticeNow = () => {
    console.log(
      "handlePracticeNow CALLED and setShowPopup set to true BUT NO CALL IS INITIATED YET"
    );

    setShowCallModal(false); // Close the CallModal
    setShowPopup(true); // Open the CallHandlerPopUp
  };

  // Booking management functions
  const handleBookingAction = async (
    bookingId: string,
    action: "accept" | "decline"
  ) => {
    try {
      const status = action === "accept" ? "accepted" : "declined";
      await BookingService.updateBookingStatus(bookingId, status);

      // Update local state
      setSelectedBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      console.log(`Booking ${bookingId} ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      alert(`Failed to ${action} booking. Please try again.`);
    }
  };

  const handleCreateBooking = async () => {
    if (startDate) {
      try {
        const newBooking = await BookingService.createBooking({
          userName: "Current User", // TODO: Get from auth context
          dateTime: startDate,
          practice: practice || "General Practice",
          status: "pending",
        });

        // Add to local state
        setSelectedBookings((prev) => [...prev, newBooking]);

        alert(`New booking created for ${startDate.toLocaleString()}`);
        console.log("Booking created successfully:", newBooking);
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("Failed to create booking. Please try again.");
      }
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "#28a745";
      case "declined":
        return "#dc3545";
      case "pending":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="call-section" onClick={(e) => e.stopPropagation()}>
      <div className="button-row">
        <button
          onClick={() => {
            setActiveTab("join");

            console.log("Joining call...");
          }}
          className={activeTab === "join" ? "active-button" : ""}
        >
          <img
            className="call-section-item call-section-logo-item"
            src={MandalaImage}
            alt={MandalaImage}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("schedule");
          }}
          className={activeTab === "schedule" ? "active-button" : ""}
        >
          <img
            className="call-section-item"
            src={PlannerImage}
            alt={PlannerImage}
          />{" "}
        </button>
      </div>

      {activeTab === "join" && (
        <div className="join-call-content">
          <button onClick={handlePracticeNow}>Practice Now</button>
        </div>
      )}

      {activeTab === "schedule" && (
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
                Bookings for this time:
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
                  No bookings found for this time slot
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
                    <div key={booking.id} className="booking-card">
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
                          <strong style={{ fontSize: "1.1rem" }}>
                            {booking.userName}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "#6c757d",
                            }}
                          >
                            {booking.practice}
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

                      {booking.status === "pending" && (
                        <div className="action-buttons">
                          <button
                            onClick={() =>
                              handleBookingAction(booking.id, "accept")
                            }
                            className="action-button accept"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleBookingAction(booking.id, "decline")
                            }
                            className="action-button decline"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create New Booking Button */}
          {startDate && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                onClick={handleCreateBooking}
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
                setActiveTab("join");
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
