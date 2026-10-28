import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./WarningCallout.vue";

describe("WarningCallout", () => {
    test("renders with alert role", () => {
        render(Subject, { slots: { default: "Warning!" } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("renders as aside element", () => {
        render(Subject, { props: { "data-testid": "wc" }, slots: { default: "W" } });
        expect(screen.getByTestId("wc").tagName).toBe("ASIDE");
    });

    test("has aria-label when provided", () => {
        render(Subject, { props: { label: "Important warning" }, slots: { default: "W" } });
        expect(screen.getByRole("alert").getAttribute("aria-label")).toBe("Important warning");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Session expiring" } });
        expect(screen.getByRole("alert").textContent).toContain("Session expiring");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "wc" }, slots: { default: "W" } });
        expect(screen.getByTestId("wc")).toBeTruthy();
    });
});
