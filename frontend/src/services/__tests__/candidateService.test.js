import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { uploadCV, sendCandidateData } from "../candidateService";
import { act } from "react"; // Import act from react

describe("candidateService", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  describe("uploadCV", () => {
    it("should upload a file and return the response data", async () => {
      const file = new Blob(["file content"], { type: "text/plain" });
      const mockResponse = {
        filePath: "/uploads/file.txt",
        fileType: "text/plain",
      };

      mock.onPost("http://localhost:3010/upload").reply(200, mockResponse);

      let result;
      await act(async () => {
        result = await uploadCV(file);
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if the upload fails", async () => {
      const file = new Blob(["file content"], { type: "text/plain" });
      const mockError = { message: "Upload failed" };

      mock.onPost("http://localhost:3010/upload").reply(500, mockError);

      await act(async () => {
        await expect(uploadCV(file)).rejects.toThrow(
          "Error al subir el archivo:"
        );
      });
    });
  });

  describe("sendCandidateData", () => {
    it("should send candidate data and return the response data", async () => {
      const candidateData = { name: "John Doe", email: "john.doe@example.com" };
      const mockResponse = { id: 1, ...candidateData };

      mock.onPost("http://localhost:3010/candidates").reply(200, mockResponse);

      let result;
      await act(async () => {
        result = await sendCandidateData(candidateData);
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if sending candidate data fails", async () => {
      const candidateData = { name: "John Doe", email: "john.doe@example.com" };
      const mockError = { message: "Sending data failed" };

      mock.onPost("http://localhost:3010/candidates").reply(500, mockError);

      await act(async () => {
        await expect(sendCandidateData(candidateData)).rejects.toThrow(
          "Error al enviar datos del candidato:"
        );
      });
    });
  });
});
