import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CalendarTable.vue";

describe("CalendarTable", () => {
    test("renders a grid", () => {
        render(Subject, { props: { label: "January" }, slots: { default: "1" } });
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(Subject, { props: { label: "January" }, slots: { default: "1" } });
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "January 2025" }, slots: { default: "1" } });
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("January 2025");
    });

    test("renders caption when provided", () => {
        render(Subject, {
            props: { label: "January", caption: "January 2025" },
            slots: { default: "1" },
        });
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("January 2025");
    });

    test("renders without caption by default", () => {
        render(Subject, { props: { label: "January" }, slots: { default: "1" } });
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children content", () => {
        render(Subject, { props: { label: "J" }, slots: { default: "15" } });
        expect(screen.getByText("15")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "J", "data-testid": "cal" }, slots: { default: "1" } });
        expect(screen.getByTestId("cal")).toBeTruthy();
    });
});
