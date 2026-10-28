import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Timer";

describe("Timer", () => {
    test("renders a time element", () => {
        render(<Subject label="Countdown">05:30</Subject>);

        const el = screen.getByRole("timer");
        expect(el.tagName).toBe("TIME");
    });

    test("has role timer", () => {
        render(<Subject label="Countdown">05:30</Subject>);

        expect(screen.getByRole("timer")).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(<Subject label="Countdown">05:30</Subject>);

        const el = screen.getByRole("timer");
        expect(el.getAttribute("aria-label")).toBe("Countdown");
    });

    test("has aria-live polite for screen reader announcements", () => {
        render(<Subject label="Countdown">05:30</Subject>);

        const el = screen.getByRole("timer");
        expect(el.getAttribute("aria-live")).toBe("polite");
    });

    test("displays children as timer content", () => {
        render(<Subject label="Countdown">05:30</Subject>);

        const el = screen.getByRole("timer");
        expect(el.textContent).toContain("05:30");
    });

    test("displays elapsed time format", () => {
        render(<Subject label="Elapsed">01:23:45</Subject>);

        const el = screen.getByRole("timer");
        expect(el.textContent).toContain("01:23:45");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Timer"
                data-testid="my-timer"
            >
                00:00
            </Subject>,
        );

        expect(screen.getByTestId("my-timer")).toBeTruthy();
    });

    test("passes through datetime attribute", () => {
        render(
            <Subject
                label="Timer"
                datetime="PT5M30S"
            >
                05:30
            </Subject>,
        );

        const el = screen.getByRole("timer");
        expect(el.getAttribute("datetime")).toBe("PT5M30S");
    });
});
