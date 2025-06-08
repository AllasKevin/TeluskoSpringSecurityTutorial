import React, { useState } from "react";
import "../PracticesPage.css";
import { ScheduleCallSection } from "./ScheduleCallSection";

interface PracticeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  descriptionVideo?: string; // Optional video URL for the practice
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded((prev) => !prev);
    // You can still call the external goToPractice if needed
    // goToPractice();
  };

  return (
    <div
      className={`practice-card ${isExpanded ? "expanded" : ""}`}
      onClick={handleCardClick}
    >
      <div className="card-content">
        <img src={imageUrl} alt={title} className="practice-image" />
        <div className="practice-details">
          <div className="practice-title">{title}</div>
          <div className="practice-description">
            <span>{description}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="expanded-content">
          <div className="expanded-row">
            <div className="video-section" onClick={(e) => e.stopPropagation()}>
              <video controls>
                <source src="./noticing_game_fixed.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <ScheduleCallSection />
          </div>
        </div>
      )}
    </div>
  );
};
