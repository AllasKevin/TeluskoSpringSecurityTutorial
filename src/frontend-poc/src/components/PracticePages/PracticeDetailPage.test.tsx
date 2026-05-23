import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import type { PracticeAppOutletContext } from "../../types/practiceAppOutlet";
import { PracticeDetailPage } from "./PracticeDetailPage";

function renderAt(path: string) {
  const setShowPopup = vi.fn();
  const setChosenPractice = vi.fn();
  const mockContext = {
    setShowPopup,
    setChosenPractice,
  } as PracticeAppOutletContext;

  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app" element={<Outlet context={mockContext} />}>
          <Route index element={<div>Inspiration home</div>} />
          <Route path="discover" element={<div>App home</div>} />
          <Route
            path="practice/:practiceSlug"
            element={<PracticeDetailPage />}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  return { setShowPopup, setChosenPractice };
}

describe("PracticeDetailPage", () => {
  it("renders editorial Asking Practice layout for askingpractice slug", async () => {
    const user = userEvent.setup();
    const { setShowPopup, setChosenPractice } = renderAt(
      "/app/practice/askingpractice"
    );
    expect(screen.getByText("Tuff Anytime")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /asking practice/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /session objectives/i })
    ).toBeInTheDocument();
    const join = screen.getByRole("button", { name: /join now/i });
    expect(join).toBeInTheDocument();
    const schedule = screen.getByRole("link", { name: /schedule for later/i });
    expect(schedule).toHaveAttribute(
      "href",
      "/app/practice/askingpractice/schedule"
    );

    await user.click(join);
    expect(setChosenPractice).toHaveBeenCalledWith("askingpractice");
    expect(setShowPopup).toHaveBeenCalledWith(true);
  });

  it("renders editorial layout for other practices with full data", () => {
    renderAt("/app/practice/noticinggame");
    expect(document.querySelector(".asking-detail")).toBeInTheDocument();
    expect(
      document.querySelector(".practice-detail-page")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /noticing game/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /session objectives/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join now/i })).toBeInTheDocument();
  });

  it("redirects to /app/discover when practice slug is unknown", () => {
    renderAt("/app/practice/unknown-slug");
    expect(screen.getByText("App home")).toBeInTheDocument();
  });
});
