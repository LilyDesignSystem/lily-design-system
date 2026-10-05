import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CalendarWeekTable";

describe("CalendarWeekTable", () => {
    test("renders a grid", () => {
        render(<Subject label="Week of 6 January 2025">1</Subject>);
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(<Subject label="Week of 6 January 2025">1</Subject>);
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has the calendar-week-table base class", () => {
        render(<Subject label="Week of 6 January 2025">1</Subject>);
        expect(screen.getByRole("grid").classList.contains("calendar-week-table")).toBe(true);
    });

    test("appends the consumer class after the base class", () => {
        render(<Subject label="Week of 6 January 2025" className="mine">1</Subject>);
        expect(screen.getByRole("grid").getAttribute("class")).toBe("calendar-week-table mine");
    });

    test("has aria-label from label", () => {
        render(<Subject label="Week of 6 January 2025">1</Subject>);
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Week of 6 January 2025");
    });

    test("marks the view as data-view=week", () => {
        render(<Subject label="Week of 6 January 2025">1</Subject>);
        expect(screen.getByRole("grid").getAttribute("data-view")).toBe("week");
    });

    test("renders caption when provided", () => {
        render(<Subject label="Week of 6 January 2025" caption="Visible caption">1</Subject>);
        expect(screen.getByRole("grid").querySelector("caption")?.textContent).toBe("Visible caption");
    });

    test("renders without caption by default", () => {
        render(<Subject label="Week of 6 January 2025">1</Subject>);
        expect(screen.getByRole("grid").querySelector("caption")).toBeNull();
    });

    test("renders children content", () => {
        render(<Subject label="Week of 6 January 2025">15</Subject>);
        expect(screen.getByText("15")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(<Subject label="Week of 6 January 2025" data-testid="cal">1</Subject>);
        expect(screen.getByTestId("cal")).toBeTruthy();
    });
});
