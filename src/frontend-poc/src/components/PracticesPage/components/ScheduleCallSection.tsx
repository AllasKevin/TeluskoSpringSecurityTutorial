import React, { useState } from "react";
import MandalaImage from "../../../assets/mandala.png";
import PlannerImage from "../../../assets/planner.png";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const ScheduleCallSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"join" | "schedule">("join"); // default is "join"
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
    console.log("Navigating to dashboard");
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
          <button onClick={goToDashboard}>Practice Now</button>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="scheduler-section">
          <p>Schedule Call</p>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15} // choose intervals: 15 mins, 30 mins, etc
            timeCaption="Time"
            dateFormat="MMM d, yyyy HH:mm" // Example: "Jun 8, 2025 14:30"
            placeholderText="Select date and time"
            popperPlacement="bottom" // Optional: ensures it pops under the field
            isClearable={false} // <--- disables clear button
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("join");
            }}
          >
            Back to Join Call
          </button>
        </div>
      )}
    </div>
  );
};
