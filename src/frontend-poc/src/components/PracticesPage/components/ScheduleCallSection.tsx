import React, {
  RefObject,
  useRef,
  useState,
  useEffect,
  useRef as useReactRef,
} from "react";
import MandalaImage from "../../../assets/mandala.png";
import PlannerImage from "../../../assets/planner.png";
import FilterImage from "../../../assets/filter.png";
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
import { useBookings } from "../../../hooks/useBookings";
import { useBookingActions } from "../../../hooks/useBookingActions";
import {
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
} from "../../../utils/bookingUtils";
import ScheduleCallTab from "./ScheduleCallTab";
import AvailableBookingsTab from "./AvailableBookingsTab";
import MyBookingsTab from "./MyBookingsTab";

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
  const [activeTab, setActiveTab] = useState<
    "join" | "schedule" | "bookings" | "mybookings"
  >("join"); // default is "join"
  // Function to get the next quarter hour
  const getNextQuarterHour = (): Date => {
    const now = new Date();
    const minutes = now.getMinutes();
    const nextQuarter = Math.ceil(minutes / 15) * 15;

    if (nextQuarter >= 60) {
      // If we're at the top of the hour, move to next hour at :00
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
    } else {
      // Set to the next quarter hour
      now.setMinutes(nextQuarter);
      now.setSeconds(0);
      now.setMilliseconds(0);
    }

    return now;
  };

  const [startDate, setStartDate] = useState<Date | null>(() =>
    getNextQuarterHour()
  );
  const [isMobile, setIsMobile] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const {
    selectedBookings,
    allBookings,
    myBookings,
    loadBookingsForDate,
    loadAllFreeBookings,
    loadMyBookings,
    setSelectedBookings,
    setAllBookings,
    setMyBookings,
  } = useBookings();
  const {
    respondToBooking,
    acceptBookingResponse,
    createBooking,
    deleteBooking,
    withdrawBookingResponse,
    declineBookingResponse,
    withdrawAcceptance,
  } = useBookingActions();

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

  // Get current username from sessionStorage
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    setCurrentUsername(username);
  }, []);

  useEffect(() => {
    if (startDate) {
      loadBookingsForDate(startDate);
    }
  }, [startDate, loadBookingsForDate]);

  // Load all free bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === "bookings") {
      loadAllFreeBookings();
    }
  }, [activeTab, loadAllFreeBookings]);

  // Load user's bookings when mybookings tab is active
  useEffect(() => {
    if (activeTab === "mybookings") {
      loadMyBookings();
    }
  }, [activeTab, currentUsername, loadMyBookings]);

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
      const status = action === "accept" ? "CONFIRMED" : "CANCELLED";
      const booking = selectedBookings.find((b) => b.id === bookingId);
      await BookingService.updateBookingStatus(bookingId, status, booking);

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

  // Respond to booking (for other users)
  const handleRespondToBooking = async (bookingId: string) => {
    try {
      const booking =
        allBookings.find((b) => b.id === bookingId) ||
        selectedBookings.find((b) => b.id === bookingId) ||
        myBookings.find((b) => b.id === bookingId);

      if (!booking) {
        console.error("Booking not found");
        return;
      }

      await respondToBooking(bookingId, booking, (updatedBooking) => {
        // Update all relevant state arrays
        setAllBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
        setSelectedBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
        setMyBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
      });

      console.log(`Responded to booking ${bookingId} successfully`);
    } catch (error) {
      console.error("Error responding to booking:", error);
      alert("Failed to respond to booking. Please try again.");
    }
  };

  // Accept booking response (for initial booker)
  const handleAcceptBookingResponse = async (
    bookingId: string,
    responderUsername: string
  ) => {
    try {
      const booking =
        myBookings.find((b) => b.id === bookingId) ||
        selectedBookings.find((b) => b.id === bookingId) ||
        allBookings.find((b) => b.id === bookingId);

      if (!booking) {
        console.error("Booking not found");
        return;
      }

      await acceptBookingResponse(
        bookingId,
        responderUsername,
        booking,
        (updatedBooking) => {
          // Update all relevant state arrays
          setMyBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? updatedBooking : b))
          );
          setSelectedBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? updatedBooking : b))
          );
          setAllBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? updatedBooking : b))
          );
        }
      );

      console.log(
        `Accepted response from ${responderUsername} for booking ${bookingId}`
      );
    } catch (error) {
      console.error("Error accepting booking response:", error);
      alert("Failed to accept booking response. Please try again.");
    }
  };

  // Booking management functions for user's bookings
  const handleMyBookingAction = async (
    bookingId: string,
    action: "accept" | "decline"
  ) => {
    try {
      const status = action === "accept" ? "CONFIRMED" : "CANCELLED";
      const booking = myBookings.find((b) => b.id === bookingId);
      await BookingService.updateBookingStatus(bookingId, status, booking);

      // Update local state
      setMyBookings((prev) =>
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
        await createBooking(
          startDate,
          practice || "General Practice",
          (newBooking) => {
            // Add to local state
            setSelectedBookings((prev) => [...prev, newBooking]);
          }
        );

        console.log("Booking created successfully");
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("Failed to create booking. Please try again.");
      }
    }
  };

  // Delete booking handler
  const handleDeleteBooking = async (bookingId: string) => {
    try {
      // Find the booking data from any of the state arrays
      const booking =
        allBookings.find((b) => b.id === bookingId) ||
        selectedBookings.find((b) => b.id === bookingId) ||
        myBookings.find((b) => b.id === bookingId);

      if (!booking) {
        console.error("Booking not found in state");
        alert("Booking not found. Please try refreshing the page.");
        return;
      }

      await deleteBooking(bookingId, booking, () => {
        // Remove from all relevant state arrays
        setSelectedBookings((prev) => prev.filter((b) => b.id !== bookingId));
        setAllBookings((prev) => prev.filter((b) => b.id !== bookingId));
        setMyBookings((prev) => prev.filter((b) => b.id !== bookingId));
      });

      console.log(`Booking ${bookingId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  // Withdraw booking response handler
  const handleWithdrawBookingResponse = async (bookingId: string) => {
    try {
      const booking =
        allBookings.find((b) => b.id === bookingId) ||
        selectedBookings.find((b) => b.id === bookingId) ||
        myBookings.find((b) => b.id === bookingId);

      if (!booking) {
        console.error("Booking not found in state");
        alert("Booking not found. Please try refreshing the page.");
        return;
      }

      await withdrawBookingResponse(bookingId, booking, (updatedBooking) => {
        // Update all relevant state arrays
        setAllBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
        setSelectedBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
        setMyBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
      });

      console.log(`Withdrew response to booking ${bookingId} successfully`);
    } catch (error) {
      console.error("Error withdrawing booking response:", error);
      alert("Failed to withdraw response. Please try again.");
    }
  };

  // Decline booking response handler
  const handleDeclineBookingResponse = async (
    bookingId: string,
    declinedResponderUsername: string
  ) => {
    try {
      const booking =
        allBookings.find((b) => b.id === bookingId) ||
        selectedBookings.find((b) => b.id === bookingId) ||
        myBookings.find((b) => b.id === bookingId);

      if (!booking) {
        console.error("Booking not found in state");
        alert("Booking not found. Please try refreshing the page.");
        return;
      }

      await declineBookingResponse(
        bookingId,
        declinedResponderUsername,
        booking,
        (updatedBooking) => {
          // Update all relevant state arrays
          setAllBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? updatedBooking : b))
          );
          setSelectedBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? updatedBooking : b))
          );
          setMyBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? updatedBooking : b))
          );
        }
      );

      console.log(
        `Declined response from ${declinedResponderUsername} for booking ${bookingId} successfully`
      );
    } catch (error) {
      console.error("Error declining booking response:", error);
      alert("Failed to decline response. Please try again.");
    }
  };

  // Withdraw acceptance handler
  const handleWithdrawAcceptance = async (bookingId: string) => {
    console.log("=== HANDLE WITHDRAW ACCEPTANCE CALLED ===");
    console.log("Looking for booking with ID:", bookingId);
    console.log("All bookings:", allBookings);
    console.log("Selected bookings:", selectedBookings);
    console.log("My bookings:", myBookings);

    try {
      const booking =
        allBookings.find((b) => b.id === bookingId) ||
        selectedBookings.find((b) => b.id === bookingId) ||
        myBookings.find((b) => b.id === bookingId);

      console.log("Found booking:", booking);

      if (!booking) {
        console.error("Booking not found in state");
        alert("Booking not found. Please try refreshing the page.");
        return;
      }

      console.log("Calling withdrawAcceptance with booking:", booking);
      await withdrawAcceptance(bookingId, booking, (updatedBooking) => {
        // Update all relevant state arrays
        setAllBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
        setSelectedBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
        setMyBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
      });

      console.log(`Withdrew acceptance for booking ${bookingId} successfully`);
    } catch (error) {
      console.error("Error withdrawing acceptance:", error);
      alert("Failed to withdraw acceptance. Please try again.");
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("bookings");
          }}
          className={activeTab === "bookings" ? "active-button" : ""}
        >
          <img
            className="call-section-item"
            src={FilterImage}
            alt="All Bookings"
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("mybookings");
          }}
          className={activeTab === "mybookings" ? "active-button" : ""}
        >
          <img
            className="call-section-item"
            src={PlannerImage}
            alt="My Bookings"
          />
        </button>
      </div>

      {activeTab === "join" && (
        <div className="join-call-content">
          <button onClick={handlePracticeNow}>Practice Now</button>
        </div>
      )}

      {activeTab === "schedule" && (
        <ScheduleCallTab
          selectedBookings={selectedBookings}
          currentUsername={currentUsername}
          onRespondToBooking={handleRespondToBooking}
          onAcceptBookingResponse={handleAcceptBookingResponse}
          onDeclineBookingResponse={handleDeclineBookingResponse}
          onWithdrawAcceptance={handleWithdrawAcceptance}
          onDeleteBooking={handleDeleteBooking}
          onWithdrawBookingResponse={handleWithdrawBookingResponse}
          formatDateTime={formatDateTime}
          getStatusColor={getStatusColor}
          isUserBooking={(booking) => isUserBooking(booking, currentUsername)}
          hasUserResponded={(booking) =>
            hasUserResponded(booking, currentUsername)
          }
          startDate={startDate}
          setStartDate={setStartDate}
          isMobile={isMobile}
          onSearchBookings={() => loadBookingsForDate(startDate)}
          onCreateBooking={handleCreateBooking}
        />
      )}

      {activeTab === "bookings" && (
        <AvailableBookingsTab
          allBookings={allBookings}
          currentUsername={currentUsername}
          onRespondToBooking={handleRespondToBooking}
          onAcceptBookingResponse={handleAcceptBookingResponse}
          onDeclineBookingResponse={handleDeclineBookingResponse}
          onWithdrawAcceptance={handleWithdrawAcceptance}
          onDeleteBooking={handleDeleteBooking}
          onWithdrawBookingResponse={handleWithdrawBookingResponse}
          formatDateTime={formatDateTime}
          getStatusColor={getStatusColor}
          isUserBooking={(booking) => isUserBooking(booking, currentUsername)}
          hasUserResponded={(booking) =>
            hasUserResponded(booking, currentUsername)
          }
        />
      )}

      {activeTab === "mybookings" && (
        <MyBookingsTab
          myBookings={myBookings}
          currentUsername={currentUsername}
          onAcceptBookingResponse={handleAcceptBookingResponse}
          onDeclineBookingResponse={handleDeclineBookingResponse}
          onWithdrawAcceptance={handleWithdrawAcceptance}
          onDeleteBooking={handleDeleteBooking}
          onWithdrawBookingResponse={handleWithdrawBookingResponse}
          formatDateTime={formatDateTime}
          getStatusColor={getStatusColor}
          isUserBooking={(booking) => isUserBooking(booking, currentUsername)}
          hasUserResponded={(booking) =>
            hasUserResponded(booking, currentUsername)
          }
        />
      )}
    </div>
  );
};
