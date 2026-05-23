import { useOutletContext } from "react-router-dom";
import { ScheduleCallSection } from "./ScheduleCallSection";
import type { PracticeAppOutletContext } from "../../../types/practiceAppOutlet";

type Forced = "join" | "schedule" | "bookings" | "mybookings";

interface ScheduleCallSectionOutletProps {
  practice: string;
  forcedTab: Forced;
  hideTabBar: boolean;
  /** Full practice schedule page layout (fixed CTA, flat chrome). */
  editorialSchedule?: boolean;
  /** /app/my-bookings full page. */
  editorialMyBookings?: boolean;
}

export function ScheduleCallSectionOutlet({
  practice,
  forcedTab,
  hideTabBar,
  editorialSchedule = false,
  editorialMyBookings = false,
}: ScheduleCallSectionOutletProps) {
  const ctx = useOutletContext<PracticeAppOutletContext>();

  return (
    <ScheduleCallSection
      practice={practice}
      forcedTab={forcedTab}
      hideTabBar={hideTabBar}
      editorialSchedule={editorialSchedule}
      editorialMyBookings={editorialMyBookings}
      callStatus={ctx.callStatus}
      updateCallStatus={ctx.updateCallStatus}
      localStream={ctx.localStream}
      setLocalStream={ctx.setLocalStream}
      remoteStream={ctx.remoteStream}
      setRemoteStream={ctx.setRemoteStream}
      peerConnection={ctx.peerConnection}
      setPeerConnection={ctx.setPeerConnection}
      offerData={ctx.offerData}
      setOfferData={ctx.setOfferData}
      remoteFeedEl={ctx.remoteFeedEl}
      localFeedEl={ctx.localFeedEl}
      gatheredAnswerIceCandidatesRef={ctx.gatheredAnswerIceCandidatesRef}
      setIceCandidatesReadyTrigger={ctx.setIceCandidatesReadyTrigger}
      remoteDescAddedForOfferer={ctx.remoteDescAddedForOfferer}
      setShowPopup={ctx.setShowPopup}
      setRemoteDescAddedForOfferer={ctx.setRemoteDescAddedForOfferer}
      setAvailableCalls={ctx.setAvailableCalls}
      currentBooking={ctx.currentBooking}
      setCurrentBooking={ctx.setCurrentBooking}
      selectedBookings={ctx.selectedBookings}
      availableBookings={ctx.availableBookings}
      myBookings={ctx.myBookings}
      loading={ctx.loading}
      error={ctx.error}
      loadBookingsForDate={ctx.loadBookingsForDate}
      loadAllFreeBookings={ctx.loadAllFreeBookings}
      loadMyBookings={ctx.loadMyBookings}
      setSelectedBookings={ctx.setSelectedBookings}
      setAvailableBookings={ctx.setAvailableBookings}
      setMyBookings={ctx.setMyBookings}
      allBookings={ctx.allBookings}
    />
  );
}
