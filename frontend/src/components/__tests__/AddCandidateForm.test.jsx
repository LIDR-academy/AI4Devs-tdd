import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AddCandidateForm from "../AddCandidateForm";

describe("AddCandidateForm", () => {
  it("renders the form correctly", () => {
    render(<AddCandidateForm />);

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellido")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo Electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Teléfono")).toBeInTheDocument();
    expect(screen.getByLabelText("Dirección")).toBeInTheDocument();
    expect(screen.getByText("Enviar")).toBeInTheDocument();
  });

  it("handles input changes correctly", () => {
    render(<AddCandidateForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Apellido"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "123 Main St" },
    });

    expect(screen.getByLabelText("Nombre").value).toBe("John");
    expect(screen.getByLabelText("Apellido").value).toBe("Doe");
    expect(screen.getByLabelText("Correo Electrónico").value).toBe(
      "john.doe@example.com"
    );
    expect(screen.getByLabelText("Teléfono").value).toBe("1234567890");
    expect(screen.getByLabelText("Dirección").value).toBe("123 Main St");
  });

  it("displays success message on successful form submission", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 201,
        json: () => Promise.resolve({}),
      })
    );

    render(<AddCandidateForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Apellido"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "123 Main St" },
    });

    fireEvent.click(screen.getByText("Enviar"));

    const successMessage = await screen.findByText(
      "Candidato añadido con éxito"
    );
    expect(successMessage).toBeInTheDocument();
  });

  it("displays error message on form submission failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({ message: "Internal Server Error" }),
      })
    );

    render(<AddCandidateForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Apellido"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "123 Main St" },
    });

    fireEvent.click(screen.getByText("Enviar"));

    const errorMessage = await screen.findByText(
      "Error al añadir candidato: Error interno del servidor"
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
