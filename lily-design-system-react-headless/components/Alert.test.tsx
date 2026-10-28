import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Alert";

describe("Alert", () => {
    test("renders with alert role", () => {
        render(<Subject>Something happened</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain("Something happened");
    });

    test("defaults to type info", () => {
        render(<Subject>Info message</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("data-type")).toBe("info");
    });

    test("applies custom type", () => {
        render(<Subject type="error">Error message</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("data-type")).toBe("error");
    });

    test("renders heading when provided", () => {
        render(<Subject heading="Warning">Be careful</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.textContent).toContain("Warning");
        expect(alert.textContent).toContain("Be careful");
    });

    test("does not render heading when not provided", () => {
        render(<Subject>No heading</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        const strong: HTMLElement | null = alert.querySelector("strong");
        expect(strong).toBeNull();
    });

    test("has aria-live assertive by default for alert role", () => {
        render(<Subject>Urgent</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("aria-live")).toBe("assertive");
    });

    test("has aria-live polite when role is status", () => {
        render(<Subject role="status">Status update</Subject>);

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("aria-live")).toBe("polite");
    });

    test("allows overriding aria-live", () => {
        render(<Subject live="off">Silent</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("aria-live")).toBe("off");
    });

    test("has aria-atomic true for complete re-reading", () => {
        render(<Subject>Atomic</Subject>);

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("aria-atomic")).toBe("true");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                id="my-alert"
                data-testid="custom-alert"
            >
                Custom
            </Subject>,
        );

        const alert: HTMLElement = screen.getByTestId("custom-alert");
        expect(alert.getAttribute("id")).toBe("my-alert");
    });
});
