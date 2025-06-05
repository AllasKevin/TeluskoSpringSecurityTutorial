import React from "react";
import { ListGroupItem } from "react-bootstrap";
import "../PracticesPage.css";

interface PracticeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  goToPractice?: () => void; // Optional function to handle click events
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
  title,
  description,
  imageUrl,
  goToPractice = () => {}, // Default to an empty function if not provided
}) => {
  return (
    <ListGroupItem className="practice-card" onClick={goToPractice}>
      <div className="card-content">
        <img src={imageUrl} alt={title} className="practice-image" />
        <div className="practice-details">
          <div className="practice-title">{title}</div>
          <div className="practice-description">
            <span>{description}</span>
          </div>
        </div>
      </div>
    </ListGroupItem>
  );
};
