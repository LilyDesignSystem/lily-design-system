import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./DateField";

describe("DateField", () => {
    test("renders labeled date input", () => {
        render(<Subject label="Start date" />);
        expect(screen.getByLabelText("Start date")).toBeTruthy();
        expect(screen.getByLabelText("Start date").getAttribute("type")).toBe("date");
    });

    test("renders description when provided", () => {
        render(
            <Subject
                label="Date"
                description="Select a date"
            />,
        );
        expect(screen.getByText("Select a date")).toBeTruthy();
    });

    test("links description via aria-describedby", () => {
        render(
            <Subject
                label="Date"
                description="Pick one"
            />,
        );
        const input = screen.getByLabelText("Date");
        const descId = input.getAttribute("aria-describedby");
        expect(descId).toBeTruthy();
        expect(document.getElementById(descId!)?.textContent).toBe("Pick one");
    });

    test("renders error message", () => {
        render(
            <Subject
                label="Date"
                error="Required field"
            />,
        );
        expect(screen.getByRole("alert").textContent).toBe("Required field");
    });

    test("sets aria-invalid on error", () => {
        render(
            <Subject
                label="Date"
                error="Bad date"
            />,
        );
        expect(screen.getByLabelText("Date").getAttribute("aria-invalid")).toBe("true");
    });

    test("links error via aria-errormessage", () => {
        render(
            <Subject
                label="Date"
                error="Invalid"
            />,
        );
        const input = screen.getByLabelText("Date");
        const errId = input.getAttribute("aria-errormessage");
        expect(errId).toBeTruthy();
        expect(document.getElementById(errId!)?.textContent).toBe("Invalid");
    });

    test("supports required attribute", () => {
        render(
            <Subject
                label="Date"
                required
            />,
        );
        expect(screen.getByLabelText("Date").hasAttribute("required")).toBe(true);
    });

    test("supports disabled attribute", () => {
        render(
            <Subject
                label="Date"
                disabled
            />,
        );
        expect((screen.getByLabelText("Date") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Date"
                data-testid="df"
            />,
        );
        expect(screen.getByTestId("df")).toBeTruthy();
    });
});
