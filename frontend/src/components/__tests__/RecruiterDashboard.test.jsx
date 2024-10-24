import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import RecruiterDashboard from "../RecruiterDashboard";

describe("RecruiterDashboard", () => {
  it("should render the dashboard title", () => {
    render(
      <Router>
        <RecruiterDashboard />
      </Router>
    );
    const title = screen.getByText("Dashboard del Reclutador");
    expect(title).toBeInTheDocument();
  });

  it('should render the "Añadir Candidato" card', () => {
    render(
      <Router>
        <RecruiterDashboard />
      </Router>
    );
    const cardTitle = screen.getByText("Añadir Candidato");
    expect(cardTitle).toBeInTheDocument();
  });

  it('should render the "Añadir Nuevo Candidato" button', () => {
    render(
      <Router>
        <RecruiterDashboard />
      </Router>
    );
    const button = screen.getByText("Añadir Nuevo Candidato");
    expect(button).toBeInTheDocument();
  });

  it('should have a link to "/add-candidate"', () => {
    render(
      <Router>
        <RecruiterDashboard />
      </Router>
    );
    const link = screen.getByRole("link", { name: "Añadir Nuevo Candidato" });
    expect(link).toHaveAttribute("href", "/add-candidate");
  });
});
