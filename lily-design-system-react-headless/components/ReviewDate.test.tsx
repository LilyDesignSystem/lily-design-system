import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ReviewDate";

describe("ReviewDate", () => {
    test("renders a time element", () => {
        render(
            <Subject
                label="Next review"
                datetime="2025-06-15"
            >
                June 15, 2025
            </Subject>,
        );

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.tagName).toBe("TIME");
    });

    test("renders label as hidden text, not aria-label", () => {
        render(
            <Subject
                label="Next review"
                datetime="2025-06-15"
            >
                June 15, 2025
            </Subject>,
        );

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.getAttribute("aria-label")).toBeNull();
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe("Next review ");
    });

    test("has datetime attribute", () => {
        render(
            <Subject
                label="Next review"
                datetime="2025-06-15"
            >
                June 15, 2025
            </Subject>,
        );

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.getAttribute("datetime")).toBe("2025-06-15");
    });

    test("displays children as text content", () => {
        render(
            <Subject
                label="Next review"
                datetime="2025-06-15"
            >
                June 15, 2025
            </Subject>,
        );

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.textContent).toContain("June 15, 2025");
    });

    test("supports ISO 8601 datetime with time", () => {
        render(
            <Subject
                label="Review"
                datetime="2025-06-15T14:30:00Z"
            >
                Jun 15 at 2:30 PM
            </Subject>,
        );

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.getAttribute("datetime")).toBe("2025-06-15T14:30:00Z");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Review"
                datetime="2025-06-15"
                data-testid="review-date"
            >
                Date
            </Subject>,
        );

        expect(screen.getByTestId("review-date")).toBeTruthy();
    });
});
