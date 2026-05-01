import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import FileUploadFormPage from "../../app/file-upload-form/page";

describe("FileUploadForm", () => {
    test("renders the heading", () => {
        render(<FileUploadFormPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Upload Documents");
    });

    test("renders upload button disabled initially", () => {
        render(<FileUploadFormPage />);
        const button = screen.getByRole("button", { name: /Upload Files/i });
        expect(button).toBeTruthy();
        expect((button as HTMLButtonElement).disabled).toBe(true);
    });
});
