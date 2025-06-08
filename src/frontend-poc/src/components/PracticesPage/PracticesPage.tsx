import React from "react";
import { PracticeCard } from "./components/PracticeCard";
import { FilterHeader } from "./components/FilterHeader";
import { NavigationBar } from "./components/NavigationBar";
import "./PracticesPage.css";
import Profilbild from "../../assets/Profilbild.jpg";
import dileva from "../../assets/dileva.jpg";
import gabor from "../../assets/gabor-mate.jpg";
import tony from "../../assets/tony-robbins.webp";
import nadine from "../../assets/nadine.jpg";
import swan from "../../assets/teal-swan.webp";

import { ListGroup } from "react-bootstrap";

export const PracticesPage: React.FC = () => {
  const practices = [
    {
      title: "Noticing Game",
      description:
        "Explore what experiences are revealed inside yourself in the present moment and relate those authentically to your co-explorer.",
      imageUrl: nadine,
    },
    {
      title: "Assert & Protect",
      description:
        "Practice how to assert and protect your boundaries in a safe space.",
      imageUrl: gabor,
      descriptionVideo:
        "https://cdn.coverr.co/videos/coverr-woman-walking-on-beach-4215/1080p.mp4",
    },
    {
      title: "Gratitude Practice",
      description:
        "Increase your awareness of the positive aspects of your life and cultivate a sense of gratitude.",
      imageUrl: tony,
    },
    {
      title: "Kirtan",
      description:
        "Engage in guided call-and-response chanting of sacred names to harmonize breath, voice, and intention.",
      imageUrl: dileva,
    },
    {
      title: "Non-Contact Improv",
      description:
        "Reflect each other’s bodily directional impulses by mirroring small initiating movements and amplifying dynamic flow.",
      imageUrl: Profilbild,
    },
    {
      title: "Echo of True Self",
      description:
        "Speak your truth and experience the power of being heard and affirmed by another.",
      imageUrl: swan,
    },
    // Repeated for all practice cards
  ];

  return (
    <>
      <div className="practices-container">
        <div className="shape-1" />
        <div className="shape-2" />
        <div className="shape-3" />
        <div className="shape-4" />
        <div className="shape-5" />

        <div className="practices-content">
          <FilterHeader />
          <ListGroup className="practices-list">
            {practices.map((practice, index) => (
              <PracticeCard
                key={index}
                title={practice.title}
                description={practice.description}
                imageUrl={practice.imageUrl}
              />
            ))}
          </ListGroup>
        </div>
      </div>
      <NavigationBar />
    </>
  );
};
