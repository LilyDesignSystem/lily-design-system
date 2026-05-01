import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import DialogFlowPage from "../../app/dialog-flow/page";

describe("DialogFlow", () => {
    test("renders the heading", () => {
        render(<DialogFlowPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Dialog Examples");
    });

    test("renders action buttons", () => {
        render(<DialogFlowPage />);
        expect(screen.getByText("Show Session Warning")).toBeTruthy();
        expect(screen.getByText("Open Help Panel")).toBeTruthy();
    });
});
