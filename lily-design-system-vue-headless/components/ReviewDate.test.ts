import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ReviewDate.vue";

describe("ReviewDate", () => {
    test("renders a time element", () => {
        render(Subject, {
            props: { label: "Next review", datetime: "2025-06-15" },
            slots: { default: "June 15, 2025" },
        });

        const el = screen.getByLabelText("Next review");
        expect(el.tagName).toBe("TIME");
    });

    test("has aria-label from label prop", () => {
        render(Subject, {
            props: { label: "Next review", datetime: "2025-06-15" },
            slots: { default: "June 15, 2025" },
        });

        const el = screen.getByLabelText("Next review");
        expect(el.getAttribute("aria-label")).toBe("Next review");
    });

    test("has datetime attribute", () => {
        render(Subject, {
            props: { label: "Next review", datetime: "2025-06-15" },
            slots: { default: "June 15, 2025" },
        });

        const el = screen.getByLabelText("Next review");
        expect(el.getAttribute("datetime")).toBe("2025-06-15");
    });

    test("displays children as text content", () => {
        render(Subject, {
            props: { label: "Next review", datetime: "2025-06-15" },
            slots: { default: "June 15, 2025" },
        });

        const el = screen.getByLabelText("Next review");
        expect(el.textContent).toContain("June 15, 2025");
    });

    test("supports ISO 8601 datetime with time", () => {
        render(Subject, {
            props: { label: "Review", datetime: "2025-06-15T14:30:00Z" },
            slots: { default: "Jun 15 at 2:30 PM" },
        });

        const el = screen.getByLabelText("Review");
        expect(el.getAttribute("datetime")).toBe("2025-06-15T14:30:00Z");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Review", datetime: "2025-06-15", "data-testid": "review-date" },
            slots: { default: "Date" },
        });

        expect(screen.getByTestId("review-date")).toBeTruthy();
    });
});
