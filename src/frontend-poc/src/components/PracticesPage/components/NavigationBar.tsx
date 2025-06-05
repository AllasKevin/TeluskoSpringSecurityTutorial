import React from "react";
import AccountImage from "../../../assets/account.png";
import PlannerImage from "../../../assets/planner.png";
import ChatImage from "../../../assets/chat-bubble.png";
import MandalaImage from "../../../assets/mandala.png";

export const NavigationBar: React.FC = () => {
  return (
    <div className="navigation-bar">
      <img
        src={MandalaImage}
        alt={MandalaImage}
        className="navigation-bar-item navigation-bar-logo-item"
      />
      <img
        src={PlannerImage}
        alt={PlannerImage}
        className="navigation-bar-item"
      />
      <img src={ChatImage} alt={ChatImage} className="navigation-bar-item" />{" "}
      <img
        src={AccountImage}
        alt={AccountImage}
        className="navigation-bar-item"
      />
    </div>
  );
};
