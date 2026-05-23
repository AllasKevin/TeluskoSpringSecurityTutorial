import React from "react";
import { useNavigate } from "react-router-dom";
import "../../PracticesPage.css";
import type { Practice } from "../../../../../../shared/practices/practices";

interface PracticeCardProps {
  practice: Practice;
  instructorPrefix?: string;
}

export function PracticeCard({
  practice,
  instructorPrefix = "with",
}: PracticeCardProps) {
  const navigate = useNavigate();
  const blurb = practice.discoveryBlurb ?? practice.description;

  const goToDetail = () => {
    navigate(`/app/practice/${practice.name}`);
  };

  return (
    <div
      className="practice-card"
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
    >
      <div className="card-content">
        {practice.imageUrl.includes("tuff-ledarskap-wordmark") ? (
          <img
            src={practice.imageUrl}
            alt=""
            className="practice-logo-icon brand-wordmark-img"
            aria-hidden
          />
        ) : (
          <img
            src={practice.imageUrl}
            alt={practice.title}
            className="practice-image"
          />
        )}
        <div className="practice-details">
          <div className="practice-title">
            <span className="title-text">{practice.title}</span>
            {practice.instructor?.name && (
              <span className="instructor-name-in-title">
                {" "}
                {instructorPrefix} {practice.instructor.name}
              </span>
            )}
          </div>
          <div className="practice-description">
            <span>{blurb}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
