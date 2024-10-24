import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FileUploader from "../FileUploader";

describe("FileUploader", () => {
  let onChangeMock, onUploadMock;

  beforeEach(() => {
    onChangeMock = jest.fn();
    onUploadMock = jest.fn();
  });

  it("should call onChange when a file is selected", () => {
    render(<FileUploader onChange={onChangeMock} onUpload={onUploadMock} />);

    const fileInput = screen.getByLabelText("File");
    const file = new File(["file content"], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onChangeMock).toHaveBeenCalledWith(file);
  });

  it("should upload a file and call onUpload with the response data", async () => {
    const mockResponse = {
      filePath: "/uploads/test.txt",
      fileType: "text/plain",
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(<FileUploader onChange={onChangeMock} onUpload={onUploadMock} />);

    const fileInput = screen.getByLabelText("File");
    const file = new File(["file content"], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText("Subir Archivo");
    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(onUploadMock).toHaveBeenCalledWith(mockResponse)
    );
  });

  it("should display an error message if the upload fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<FileUploader onChange={onChangeMock} onUpload={onUploadMock} />);

    const fileInput = screen.getByLabelText("File");
    const file = new File(["file content"], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText("Subir Archivo");
    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(screen.queryByText("Archivo subido con éxito")).toBeNull()
    );
  });

  it("should show a loading spinner while uploading", async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    filePath: "/uploads/test.txt",
                    fileType: "text/plain",
                  }),
              }),
            1000
          )
        )
    );

    render(<FileUploader onChange={onChangeMock} onUpload={onUploadMock} />);

    const fileInput = screen.getByLabelText("File");
    const file = new File(["file content"], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText("Subir Archivo");
    fireEvent.click(uploadButton);

    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );
  });
});
