import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CalendarDayTable.vue";

const L = "Monday 6 January 2025";

describe("CalendarDayTable", () => {
    test("renders a grid", () => {
        render(Subject, { props: { label: L }, slots: { default: "1" } });
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(Subject, { props: { label: L }, slots: { default: "1" } });
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has the calendar-day-table base class", () => {
        render(Subject, { props: { label: L }, slots: { default: "1" } });
        expect(screen.getByRole("grid").classList.contains("calendar-day-table")).toBe(true);
    });

    test("appends the consumer class after the base class", () => {
        render(Subject, { props: { label: L }, attrs: { class: "mine" }, slots: { default: "1" } });
        expect(screen.getByRole("grid").getAttribute("class")).toBe("calendar-day-table mine");
    });

    test("has aria-label from label", () => {
        render(Subject, { props: { label: L }, slots: { default: "1" } });
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe(L);
    });

    test("marks the view as data-view=day", () => {
        render(Subject, { props: { label: L }, slots: { default: "1" } });
        expect(screen.getByRole("grid").getAttribute("data-view")).toBe("day");
    });

    test("renders caption when provided", () => {
        render(Subject, { props: { label: L, caption: "Visible caption" }, slots: { default: "1" } });
        expect(screen.getByRole("grid").querySelector("caption")?.textContent).toBe("Visible caption");
    });

    test("renders without caption by default", () => {
        render(Subject, { props: { label: L }, slots: { default: "1" } });
        expect(screen.getByRole("grid").querySelector("caption")).toBeNull();
    });

    test("renders slot content", () => {
        render(Subject, { props: { label: L }, slots: { default: "15" } });
        expect(screen.getByText("15")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: L }, attrs: { "data-testid": "cal" }, slots: { default: "1" } });
        expect(screen.getByTestId("cal")).toBeTruthy();
    });
});
