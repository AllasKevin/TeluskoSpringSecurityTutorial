import React, { useState, useEffect } from 'react';
import MandalaImage from '../../../../assets/mandala.png';
import PlannerImage from '../../../../assets/planner.png';
import FilterImage from '../../../../assets/filter.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ScheduleCallSection.css';
import { CallStatus } from '../../../../App';
import { CallData } from '../../../Dashboard';
import { Booking } from '../../../../types/booking';
import { BookingService } from '../../../../services/bookingService';
import { useBookingActions } from '../../../../hooks/useBookingActions';
import {
  formatDateTime,
  getStatusColor,
  isUserBooking,
  hasUserResponded,
} from '../../../../utils/bookingUtils';
import ScheduleCallTab from '../ScheduleCallTab';
import AvailableBookingsTab from '../AvailableBookingsTab';
import MyBookingsTab from '../MyBookingsTab';
import { RefObject } from 'react';

interface ScheduleCallSectionProps {
  practice: string;
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<React.SetStateAction<CallStatus | undefined>>;
  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<React.SetStateAction<RTCPeerConnection | undefined>>;
  offerData: CallData | undefined;
  setOfferData: React.Dispatch<React.SetStateAction<CallData | undefined>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCallModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
  currentBooking: Booking | undefined;
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
  selectedBookings: Booking[];
  availableBookings: Booking[];
  myBookings: Booking[];
  loading: boolean;
  error: string | null;
  loadBookingsForDate: (startDate: Date | null) => Promise<void>;
  loadAllFreeBookings: () => Promise<void>;
  loadMyBookings: () => Promise<void>;
  setSelectedBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setAvailableBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setMyBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allBookings: Booking[];
}

type ActiveTab = 'join' | 'schedule' | 'bookings' | 'mybookings';

const getNextQuarterHour = (): Date => {
  const now = new Date();
  const minutes = now.getMinutes();
  const nextQuarter = Math.ceil(minutes / 15) * 15;

  if (nextQuarter >= 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(nextQuarter);
  }
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
};

export const ScheduleCallSection: React.FC<ScheduleCallSectionProps> = ({
  practice,
  setShowPopup,
  setShowCallModal,
  currentBooking,
  setCurrentBooking,
  selectedBookings,
  availableBookings,
  myBookings,
  loadBookingsForDate,
  loadAllFreeBookings,
  loadMyBookings,
  setSelectedBookings,
  setAvailableBookings,
  setMyBookings,
  allBookings,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('join');
  const [startDate, setStartDate] = useState<Date | null>(() => getNextQuarterHour());
  const [isMobile, setIsMobile] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const {
    respondToBooking,
    acceptBookingResponse,
    createBooking,
    deleteBooking,
    withdrawBookingResponse,
    declineBookingResponse,
    withdrawAcceptance,
  } = useBookingActions();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setCurrentUsername(sessionStorage.getItem('username'));
  }, []);

  useEffect(() => {
    if (startDate) loadBookingsForDate(startDate);
  }, [startDate, loadBookingsForDate]);

  useEffect(() => {
    if (activeTab === 'schedule') {
      loadAllFreeBookings();
      loadMyBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'bookings') loadAllFreeBookings();
  }, [activeTab, loadAllFreeBookings]);

  useEffect(() => {
    if (activeTab === 'mybookings') loadMyBookings();
  }, [activeTab, currentUsername, loadMyBookings]);

  const handlePracticeNow = () => {
    setShowCallModal(false);
    setShowPopup(true);
  };

  const findBooking = (bookingId: string): Booking | undefined =>
    availableBookings.find((b) => b.id === bookingId) ||
    selectedBookings.find((b) => b.id === bookingId) ||
    myBookings.find((b) => b.id === bookingId);

  const updateAllBookingArrays = (bookingId: string, updatedBooking: Booking) => {
    const updater = (prev: Booking[]) =>
      prev.map((b) => (b.id === bookingId ? updatedBooking : b));
    setAvailableBookings(updater);
    setSelectedBookings(updater);
    setMyBookings(updater);
  };

  const handleRespondToBooking = async (bookingId: string) => {
    const booking = findBooking(bookingId);
    if (!booking) return;

    await respondToBooking(bookingId, booking, (updatedBooking) => {
      updateAllBookingArrays(bookingId, updatedBooking);
      setMyBookings((prev) => {
        if (prev.some((b) => b.id === bookingId)) {
          return prev.map((b) => (b.id === bookingId ? updatedBooking : b));
        }
        return [...prev, updatedBooking];
      });
    });
  };

  const handleAcceptBookingResponse = async (bookingId: string, responderUsername: string) => {
    const booking = findBooking(bookingId);
    if (!booking) return;

    await acceptBookingResponse(bookingId, responderUsername, booking, (updatedBooking) => {
      updateAllBookingArrays(bookingId, updatedBooking);
    });
  };

  const handleCreateBooking = async () => {
    if (!startDate) return;

    try {
      await createBooking(startDate, practice || 'General Practice', (newBooking) => {
        setSelectedBookings((prev) => [...prev, newBooking]);
      });
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status === 400) {
        alert('You can not book two calls at the same timeslot.');
      } else {
        alert('Failed to create booking. Please try again.');
      }
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const booking = findBooking(bookingId);
    if (!booking) {
      alert('Booking not found. Please try refreshing the page.');
      return;
    }

    await deleteBooking(bookingId, booking, () => {
      const remover = (prev: Booking[]) => prev.filter((b) => b.id !== bookingId);
      setSelectedBookings(remover);
      setAvailableBookings(remover);
      setMyBookings(remover);
    });
  };

  const handleWithdrawBookingResponse = async (bookingId: string) => {
    const booking = findBooking(bookingId);
    if (!booking) {
      alert('Booking not found. Please try refreshing the page.');
      return;
    }

    await withdrawBookingResponse(bookingId, booking, (updatedBooking) => {
      updateAllBookingArrays(bookingId, updatedBooking);
    });
  };

  const handleDeclineBookingResponse = async (bookingId: string, declinedResponderUsername: string) => {
    const booking = findBooking(bookingId);
    if (!booking) {
      alert('Booking not found. Please try refreshing the page.');
      return;
    }

    await declineBookingResponse(bookingId, declinedResponderUsername, booking, (updatedBooking) => {
      updateAllBookingArrays(bookingId, updatedBooking);
    });
  };

  const handleWithdrawAcceptance = async (bookingId: string) => {
    const booking = findBooking(bookingId);
    if (!booking) {
      alert('Booking not found. Please try refreshing the page.');
      return;
    }

    await withdrawAcceptance(bookingId, booking, (updatedBooking) => {
      updateAllBookingArrays(bookingId, updatedBooking);
    });
  };

  const commonBookingProps = {
    currentUsername,
    formatDateTime,
    getStatusColor,
    isUserBooking: (booking: Booking) => isUserBooking(booking, currentUsername),
    hasUserResponded: (booking: Booking) => hasUserResponded(booking, currentUsername),
    setShowPopup,
    currentBooking,
    setCurrentBooking,
  };

  const commonActionProps = {
    onRespondToBooking: handleRespondToBooking,
    onAcceptBookingResponse: handleAcceptBookingResponse,
    onDeclineBookingResponse: handleDeclineBookingResponse,
    onWithdrawAcceptance: handleWithdrawAcceptance,
    onDeleteBooking: handleDeleteBooking,
    onWithdrawBookingResponse: handleWithdrawBookingResponse,
  };

  return (
    <div className="call-section" onClick={(e) => e.stopPropagation()}>
      <div className="button-row">
        <button
          onClick={() => setActiveTab('join')}
          className={activeTab === 'join' ? 'active-button' : ''}
        >
          <img className="call-section-item call-section-logo-item" src={MandalaImage} alt="Join" />
          <span className="tab-label">Join</span>
        </button>
        {practice !== 'anypractice' && (
          <button
            onClick={(e) => { e.stopPropagation(); setActiveTab('schedule'); }}
            className={activeTab === 'schedule' ? 'active-button' : ''}
          >
            <img className="call-section-item" src={PlannerImage} alt="Schedule" />
            <span className="tab-label">Schedule</span>
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setActiveTab('bookings'); }}
          className={activeTab === 'bookings' ? 'active-button' : ''}
        >
          <img className="call-section-item" src={FilterImage} alt="All Bookings" />
          <span className="tab-label">All Bookings</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setActiveTab('mybookings'); }}
          className={activeTab === 'mybookings' ? 'active-button' : ''}
        >
          <img className="call-section-item" src={PlannerImage} alt="My Bookings" />
          <span className="tab-label">My Bookings</span>
        </button>
      </div>

      {activeTab === 'join' && (
        <div className="join-call-content">
          <h3>Ready to Practice?</h3>
          <p>
            Start an instant practice session and connect with others who are
            ready to explore together right now.
          </p>
          <button onClick={handlePracticeNow}>Practice Now</button>
        </div>
      )}

      {activeTab === 'schedule' && (
        <ScheduleCallTab
          practice={practice}
          selectedBookings={selectedBookings}
          startDate={startDate}
          setStartDate={setStartDate}
          isMobile={isMobile}
          onSearchBookings={() => loadBookingsForDate(startDate)}
          onCreateBooking={handleCreateBooking}
          allBookings={allBookings}
          {...commonBookingProps}
          {...commonActionProps}
        />
      )}

      {activeTab === 'bookings' && (
        <AvailableBookingsTab
          practice={practice}
          availableBookings={availableBookings}
          {...commonBookingProps}
          {...commonActionProps}
        />
      )}

      {activeTab === 'mybookings' && (
        <MyBookingsTab
          practice={practice}
          myBookings={myBookings}
          {...commonBookingProps}
          {...commonActionProps}
          onAcceptBookingResponse={handleAcceptBookingResponse}
        />
      )}
    </div>
  );
};
