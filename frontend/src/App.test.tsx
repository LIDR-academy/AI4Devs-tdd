import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/RecruiterDashboard", () => {
  return () => <div data-testid="recruiter-dashboard">Recruiter Dashboard</div>;
});

jest.mock("./components/AddCandidateForm", () => {
  return () => <div data-testid="add-candidate-form">Add Candidate Form</div>;
});

test("renders recruiter dashboard by default", () => {
  render(<App />);
  const dashboardElement = screen.getByTestId("recruiter-dashboard");
  expect(dashboardElement).toBeInTheDocument();
});
