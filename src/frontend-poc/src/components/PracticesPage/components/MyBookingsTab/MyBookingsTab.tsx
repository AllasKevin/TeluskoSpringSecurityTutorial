import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MyBookingsTabProps } from "../../../../types/bookingComponents";
import BookingCard from "../BookingCard";
import { isUserBooking, hasUserResponded } from "../../../../utils/bookingUtils";
import { appDiscoveryPage } from "../../../../../../shared/practices/practices";
import "./MyBookingsTab.css";

type ListTab = "upcoming" | "past";

const MyBookingsTab: React.FC<MyBookingsTabProps> = ({
  practice,
  myBookings,
  pageLayout = false,
  currentUsername,
  onAcceptBookingResponse,
  onDeclineBookingResponse,
  onWithdrawAcceptance,
  onDeleteBooking,
  onWithdrawBookingResponse,
  formatDateTime,
  getStatusColor,
  isUserBooking: isUserBookingProp,
  hasUserResponded: hasUserRespondedProp,
  setShowPopup,
  currentBooking,
  setCurrentBooking,
}) => {
  const copy = appDiscoveryPage;
  const [listTab, setListTab] = useState<ListTab>("upcoming");

  const activeBookings = useMemo(
    () =>
      myBookings
        .filter((booking) => {
          if (isUserBooking(booking, currentUsername)) return true;
          return hasUserResponded(booking, currentUsername);
        })
        .filter((b) => b.practice === practice || practice === "anypractice"),
    [myBookings, practice, currentUsername],
  );

  const upcoming = useMemo(() => {
    const now = new Date();
    return activeBookings
      .filter((b) => new Date(b.dateTime) >= now)
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
      );
  }, [activeBookings]);

  const past = useMemo(() => {
    const now = new Date();
    return activeBookings
      .filter((b) => new Date(b.dateTime) < now)
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
      );
  }, [activeBookings]);

  const visible = listTab === "upcoming" ? upcoming : past;
  const emptyMessage =
    listTab === "upcoming"
      ? copy.myBookingsEmptyUpcoming
      : copy.myBookingsEmptyPast;

  const rootClass =
    "my-bookings" + (pageLayout ? "" : " my-bookings--embedded");

  return (
    <div className={rootClass}>
      {!pageLayout && (
        <>
          <h3 className="my-bookings__heading">My Bookings</h3>
          <p className="my-bookings__subheading">Your bookings:</p>
        </>
      )}

      <div
        className="my-bookings__tabs"
        role="tablist"
        aria-label="Filter bookings by time"
      >
        <button
          type="button"
          role="tab"
          id="my-bookings-tab-upcoming"
          aria-selected={listTab === "upcoming"}
          className={
            "my-bookings__tab" +
            (listTab === "upcoming" ? " my-bookings__tab--active" : "")
          }
          onClick={() => setListTab("upcoming")}
        >
          {copy.myBookingsTabUpcoming}
        </button>
        <button
          type="button"
          role="tab"
          id="my-bookings-tab-past"
          aria-selected={listTab === "past"}
          className={
            "my-bookings__tab" +
            (listTab === "past" ? " my-bookings__tab--active" : "")
          }
          onClick={() => setListTab("past")}
        >
          {copy.myBookingsTabPast}
        </button>
      </div>

      <div
        role="tabpanel"
        aria-labelledby={
          listTab === "upcoming"
            ? "my-bookings-tab-upcoming"
            : "my-bookings-tab-past"
        }
      >
        {visible.length === 0 ? (
          <p className="my-bookings__empty">{emptyMessage}</p>
        ) : (
          <div className="my-bookings__list">
            {visible.map((booking) => (
              <div key={booking.id} className="my-bookings__card-surface">
                <BookingCard
                  booking={booking}
                  cardLayout="schedule"
                  currentUsername={currentUsername}
                  onAcceptBookingResponse={onAcceptBookingResponse}
                  onDeclineBookingResponse={onDeclineBookingResponse}
                  onWithdrawAcceptance={onWithdrawAcceptance}
                  onDeleteBooking={onDeleteBooking}
                  onWithdrawBookingResponse={onWithdrawBookingResponse}
                  formatDateTime={formatDateTime}
                  getStatusColor={getStatusColor}
                  isUserBooking={isUserBookingProp}
                  hasUserResponded={hasUserRespondedProp}
                  setShowPopup={setShowPopup}
                  currentBooking={currentBooking}
                  setCurrentBooking={setCurrentBooking}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {pageLayout && (
        <div className="my-bookings__explore">
          <div className="my-bookings__explore-icon-wrap">
            <span
              className="material-symbols-outlined my-bookings__explore-icon"
              aria-hidden
            >
              add_task
            </span>
          </div>
          <div>
            <h2 className="my-bookings__explore-title">
              {copy.myBookingsExploreTitle}
            </h2>
            <p className="my-bookings__explore-hint">
              {copy.myBookingsExploreHint}
            </p>
          </div>
          <Link
            to="/app/practice/anypractice/schedule"
            className="my-bookings__explore-link"
          >
            {copy.myBookingsExploreCta}
            <span className="material-symbols-outlined" aria-hidden>
              arrow_forward
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookingsTab;
