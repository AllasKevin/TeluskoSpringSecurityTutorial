import React, { useEffect, useMemo } from "react";
import { ScheduleCallTabProps } from "../../../../types/bookingComponents";
import BookingCard from "../BookingCard";
import { appDiscoveryPage } from "../../../../../../shared/practices/practices";
import "./ScheduleSession.css";

const DAY_COUNT = 14;
const HOUR_START = 8;
const HOUR_END = 20;
const MINUTE_STEPS = [0, 15, 30, 45] as const;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDaysFrom(baseMidnight: Date, n: number): Date {
  const x = new Date(baseMidnight);
  x.setDate(x.getDate() + n);
  return startOfDay(x);
}

function clampWorkHours(d: Date): Date {
  const lo = new Date(d);
  lo.setHours(HOUR_START, 0, 0, 0);
  const hi = new Date(d);
  hi.setHours(HOUR_END, 0, 0, 0);
  const t = d.getTime();
  if (t < lo.getTime()) return lo;
  if (t > hi.getTime()) return hi;
  return new Date(d);
}

function applyCalendarDay(time: Date, dayMidnight: Date): Date {
  const x = new Date(time);
  x.setFullYear(
    dayMidnight.getFullYear(),
    dayMidnight.getMonth(),
    dayMidnight.getDate(),
  );
  return x;
}

function nearestQuarter(minute: number): (typeof MINUTE_STEPS)[number] {
  return MINUTE_STEPS.reduce((a, b) =>
    Math.abs(b - minute) < Math.abs(a - minute) ? b : a,
  );
}

function snapQuarter(d: Date): Date {
  const x = new Date(d);
  x.setMinutes(nearestQuarter(x.getMinutes()), 0, 0);
  return x;
}

/** Canonical slot on the visible day: quarter-hour aligned, 8:00–20:00. */
function resolveSlot(
  startDate: Date | null,
  dayMidnight: Date,
): Date {
  let base: Date;
  if (startDate) {
    base = applyCalendarDay(startDate, dayMidnight);
  } else {
    base = new Date(dayMidnight);
    base.setHours(9, 0, 0, 0);
  }
  base = clampWorkHours(base);
  const mq = nearestQuarter(base.getMinutes());
  base.setMinutes(mq, 0, 0);
  return clampWorkHours(base);
}

function to12h(d: Date): { h12: number; minute: number; isPm: boolean } {
  const h24 = d.getHours();
  const isPm = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return { h12, minute: d.getMinutes(), isPm };
}

function stepHour(current: Date, dir: 1 | -1): Date {
  const x = new Date(current);
  x.setHours(x.getHours() + dir, x.getMinutes(), 0, 0);
  return clampWorkHours(x);
}

function stepMinute(current: Date, dir: 1 | -1): Date {
  const x = new Date(current);
  let idx = MINUTE_STEPS.indexOf(x.getMinutes() as (typeof MINUTE_STEPS)[number]);
  if (idx < 0) {
    const q = nearestQuarter(x.getMinutes());
    idx = MINUTE_STEPS.indexOf(q);
  }
  let newIdx = idx + dir;
  let h = x.getHours();
  if (newIdx > MINUTE_STEPS.length - 1) {
    newIdx = 0;
    h += 1;
  } else if (newIdx < 0) {
    newIdx = MINUTE_STEPS.length - 1;
    h -= 1;
  }
  x.setHours(h, MINUTE_STEPS[newIdx], 0, 0);
  return clampWorkHours(x);
}

function setMeridiem(current: Date, targetPm: boolean): Date {
  const h24 = current.getHours();
  const isPm = h24 >= 12;
  if (isPm === targetPm) return clampWorkHours(current);
  const x = new Date(current);
  x.setHours(x.getHours() + 12);
  return clampWorkHours(x);
}

const ScheduleCallTab: React.FC<ScheduleCallTabProps> = ({
  practice,
  selectedBookings: _selectedBookings,
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
  isMobile: _isMobile,
  onSearchBookings: _onSearchBookings,
  onCreateBooking,
  setShowPopup,
  currentBooking,
  setCurrentBooking,
  allBookings,
  layout = "embedded",
}) => {
  const copy = appDiscoveryPage;

  const rangeStart = useMemo(() => startOfDay(new Date()), []);

  const dayStrip = useMemo(
    () =>
      Array.from({ length: DAY_COUNT }, (_, i) => addDaysFrom(rangeStart, i)),
    [rangeStart],
  );

  const activeDayStart = useMemo(() => {
    const ref = startDate ?? new Date();
    return startOfDay(ref);
  }, [startDate]);

  const resolvedSlot = useMemo(
    () => resolveSlot(startDate, activeDayStart),
    [startDate, activeDayStart],
  );

  useEffect(() => {
    if (startDate == null) return;
    const aligned = resolveSlot(startDate, activeDayStart);
    if (aligned.getTime() !== startDate.getTime()) {
      setStartDate(aligned);
    }
  }, [startDate, activeDayStart, setStartDate]);

  const { h12, minute, isPm } = to12h(resolvedSlot);
  const hourLabel = String(h12).padStart(2, "0");
  const minuteLabel = String(minute).padStart(2, "0");

  const handleSelectDay = (dayMidnight: Date) => {
    const next = new Date(dayMidnight);
    if (startDate) {
      next.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
    } else {
      next.setHours(9, 0, 0, 0);
    }
    setStartDate(clampWorkHours(snapQuarter(next)));
  };

  const commitSlot = (next: Date) => {
    setStartDate(clampWorkHours(snapQuarter(next)));
  };

  const filteredBookings = allBookings.filter(
    (b) =>
      new Date(b.dateTime).getTime() === resolvedSlot.getTime() &&
      (b.practice === practice || practice === "anypractice"),
  );

  const rootClass =
    "schedule-session" +
    (layout === "page"
      ? " schedule-session--page schedule-session--editorial-grid"
      : " schedule-session--embedded");

  return (
    <div className={rootClass}>
      <section
        className="schedule-session__block schedule-session__block--calendar"
        aria-labelledby="sched-date-h"
      >
        <h3 id="sched-date-h" className="schedule-session__section-title">
          {copy.scheduleDateHeading}
        </h3>
        <div className="schedule-session__date-strip" role="list">
          {dayStrip.map((d) => {
            const selected = sameDay(d, activeDayStart);
            const month = d
              .toLocaleDateString("en-US", { month: "short" })
              .toUpperCase();
            const dow = d
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase();
            return (
              <button
                key={d.getTime()}
                type="button"
                className={
                  "schedule-session__date-chip" +
                  (selected ? " schedule-session__date-chip--active" : "")
                }
                onClick={() => handleSelectDay(d)}
                aria-pressed={selected}
                aria-label={d.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              >
                <span className="schedule-session__date-chip-month">{month}</span>
                <span className="schedule-session__date-chip-day">{d.getDate()}</span>
                <span className="schedule-session__date-chip-dow">{dow}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="schedule-session__block schedule-session__block--slots"
        aria-labelledby="sched-slots-h"
      >
        <h3 id="sched-slots-h" className="schedule-session__section-title">
          {copy.scheduleSlotsHeading}
        </h3>
        <div className="schedule-session__time-panel">
          <div className="schedule-session__time-row">
            <div className="schedule-session__time-col">
              <button
                type="button"
                className="schedule-session__time-step-btn"
                aria-label="Increase hour"
                onClick={() => commitSlot(stepHour(resolvedSlot, 1))}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  expand_less
                </span>
              </button>
              <span className="schedule-session__time-digit">{hourLabel}</span>
              <button
                type="button"
                className="schedule-session__time-step-btn"
                aria-label="Decrease hour"
                onClick={() => commitSlot(stepHour(resolvedSlot, -1))}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  expand_more
                </span>
              </button>
            </div>
            <span className="schedule-session__time-colon" aria-hidden>
              :
            </span>
            <div className="schedule-session__time-col">
              <button
                type="button"
                className="schedule-session__time-step-btn"
                aria-label="Increase minutes"
                onClick={() => commitSlot(stepMinute(resolvedSlot, 1))}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  expand_less
                </span>
              </button>
              <span className="schedule-session__time-digit">{minuteLabel}</span>
              <button
                type="button"
                className="schedule-session__time-step-btn"
                aria-label="Decrease minutes"
                onClick={() => commitSlot(stepMinute(resolvedSlot, -1))}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  expand_more
                </span>
              </button>
            </div>
            <div
              className="schedule-session__time-ampm"
              role="group"
              aria-label="Morning or afternoon"
            >
              <button
                type="button"
                className={
                  "schedule-session__time-ampm-btn" +
                  (!isPm
                    ? " schedule-session__time-ampm-btn--active"
                    : " schedule-session__time-ampm-btn--inactive")
                }
                aria-pressed={!isPm}
                onClick={() =>
                  commitSlot(setMeridiem(resolvedSlot, false))
                }
              >
                AM
              </button>
              <button
                type="button"
                className={
                  "schedule-session__time-ampm-btn" +
                  (isPm
                    ? " schedule-session__time-ampm-btn--active"
                    : " schedule-session__time-ampm-btn--inactive")
                }
                aria-pressed={isPm}
                onClick={() => commitSlot(setMeridiem(resolvedSlot, true))}
              >
                PM
              </button>
            </div>
          </div>
          <p className="schedule-session__time-hint">{copy.scheduleTimeAdjustHint}</p>
        </div>
      </section>

      <section
        className="schedule-session__block schedule-session__block--full"
        aria-labelledby="sched-sessions-h"
      >
        <h3 id="sched-sessions-h" className="schedule-session__section-title">
          {copy.scheduleSessionsHeading}
        </h3>
        {filteredBookings.length === 0 ? (
          <p className="schedule-session__empty">{copy.scheduleEmptySessions}</p>
        ) : (
          <div className="schedule-session__cards">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="schedule-session__card-surface">
                <BookingCard
                  booking={booking}
                  cardLayout="schedule"
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
              </div>
            ))}
          </div>
        )}
      </section>

      <div
        className={
          layout === "page"
            ? "schedule-session__cta-fixed"
            : "schedule-session__cta-inline"
        }
      >
        <button
          type="button"
          className="schedule-session__cta-primary"
          onClick={onCreateBooking}
          disabled={!startDate}
        >
          {copy.scheduleConfirmCta}
        </button>
      </div>
    </div>
  );
};

export default ScheduleCallTab;
