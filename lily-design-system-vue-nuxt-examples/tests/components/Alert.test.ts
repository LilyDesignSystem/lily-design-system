import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Alert.vue";

describe("Alert", () => {
    test("renders with alert role", () => {
        render(Subject, { slots: { default: "Something happened" } });

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain("Something happened");
    });

    test("defaults to type info", () => {
        render(Subject, { slots: { default: "Info message" } });

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("data-type")).toBe("info");
    });

    test("applies custom type", () => {
        render(Subject, { props: { type: "error" }, slots: { default: "Error message" } });

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("data-type")).toBe("error");
    });

    test("renders heading when provided", () => {
        render(Subject, { props: { heading: "Warning" }, slots: { default: "Be careful" } });

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.textContent).toContain("Warning");
        expect(alert.textContent).toContain("Be careful");
    });

    test("does not render heading when not provided", () => {
        render(Subject, { slots: { default: "No heading" } });

        const alert: HTMLElement = screen.getByRole("alert");
        const strong: HTMLElement | null = alert.querySelector("strong");
        expect(strong).toBeNull();
    });

    test("has aria-live assertive by default for alert role", () => {
        render(Subject, { slots: { default: "Urgent" } });

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("aria-live")).toBe("assertive");
    });

    test("has aria-live polite when role is status", () => {
        render(Subject, { props: { role: "status" }, slots: { default: "Status update" } });

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("aria-live")).toBe("polite");
    });

    test("allows overriding aria-live", () => {
        render(Subject, { props: { live: "off" }, slots: { default: "Silent" } });

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("aria-live")).toBe("off");
    });

    test("has aria-atomic true for complete re-reading", () => {
        render(Subject, { slots: { default: "Atomic" } });

        const alert: HTMLElement = screen.getByRole("alert");
        expect(alert.getAttribute("aria-atomic")).toBe("true");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { id: "my-alert", "data-testid": "custom-alert" },
            slots: { default: "Custom" },
        });

        const alert: HTMLElement = screen.getByTestId("custom-alert");
        expect(alert.getAttribute("id")).toBe("my-alert");
    });
});
