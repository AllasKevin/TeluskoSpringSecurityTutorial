import React from "react";
import { PracticeCard } from "./components/PracticeCard";
import { FilterHeader } from "./components/FilterHeader";
import "./PracticesPage.css";
import {
  appDiscoveryPage,
  practices,
} from "../../../../shared/practices/practices";
import { ListGroup } from "react-bootstrap";

export const PracticesPage: React.FC = () => {
  const copy = appDiscoveryPage;

  return (
    <>
      <div className="practices-container">
        <div className="practices-content">
          <FilterHeader />
          <section
            className="practices-hero"
            aria-labelledby="practices-heading"
          >
            <p className="practices-hero__eyebrow">{copy.heroEyebrow}</p>
            <h1 id="practices-heading" className="practices-hero__title">
              {copy.heroTitle}
            </h1>
            <p className="practices-hero__sub">{copy.heroSubtitle}</p>
          </section>
          <ListGroup className="practices-list">
            {practices.map((practice, index) => (
              <PracticeCard
                key={practice.name ?? index}
                practice={practice}
                instructorPrefix={copy.cardInstructorPrefix}
              />
            ))}
          </ListGroup>
        </div>
      </div>
    </>
  );
};
