/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../components/RecruiterDashboard", () => () => (
  <div>RecruiterDashboard Mock</div>
));
jest.mock("../components/AddCandidateForm", () => () => (
  <div>AddCandidate Mock</div>
));

describe("App Component", () => {
  test("renders RecruiterDashboard component for the root path", () => {
    render(<App />);
    expect(screen.getByText("RecruiterDashboard Mock")).toBeInTheDocument();
  });

  test("renders AddCandidate component for the /add-candidate path", () => {
    window.history.pushState({}, "Add Candidate", "/add-candidate");
    render(<App />);
    expect(screen.getByText("AddCandidate Mock")).toBeInTheDocument();
  });
});
