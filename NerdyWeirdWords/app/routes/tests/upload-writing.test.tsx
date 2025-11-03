import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadWriting from "../upload-writing";
import * as uploadModule from "../../postWriting";

// Mock del modulo postWriting
jest.mock("../../postWriting", () => ({
  postWriting: jest.fn(),
}));

describe("UploadWriting component", () => {
  const mockPostWriting = uploadModule.postWriting as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<UploadWriting />);
    expect(screen.getByRole("heading", { name: /upload writing/i })).toBeInTheDocument();
    expect(screen.getByText(/pick a file/i)).toBeInTheDocument();
  });

  it("shows an error alert when validation fails", async () => {
    mockPostWriting.mockResolvedValue("400 : You must indicate a file!");

    render(<UploadWriting />);

    // 👇 cerca per tag, non per role="form" (che <form> non ha di default)
    const form = screen.getByRole("button", { name: /upload/i }).closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("400 : You must indicate a file!");
    });
  });

  it("shows success message after upload", async () => {
    mockPostWriting.mockResolvedValue(null);

    render(<UploadWriting />);

    const form = screen.getByRole("button", { name: /upload/i }).closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Writing uploaded successfully!");
    });
  });

  it("disables the button while uploading", async () => {
    mockPostWriting.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(null), 100))
    );

    render(<UploadWriting />);

    const button = screen.getByRole("button", { name: /upload/i });
    const form = button.closest("form")!;

    fireEvent.submit(form);

    // Subito dopo il submit
    expect(button).toBeDisabled();

    // Dopo la promessa risolta
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
