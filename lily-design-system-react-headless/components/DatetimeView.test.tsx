import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./DatetimeView";

describe("DatetimeView", () => {
    test("renders a <time> element with the dateTime attribute", () => {
        const { container } = render(
            <Subject value="2026-01-15T09:30:00Z" data-testid="dt" />,
        );

        const time: HTMLElement = screen.getByTestId("dt");
        expect(time.tagName).toBe("TIME");
        expect(time.getAttribute("datetime")).toBe("2026-01-15T09:30:00Z");
        expect(container.querySelector("time")).toBeTruthy();
    });

    test("applies the datetime-view root class", () => {
        render(<Subject value="2026-01-15" data-testid="dt" />);

        const el: HTMLElement = screen.getByTestId("dt");
        expect(el.className.includes("datetime-view")).toBe(true);
    });

    test("falls back to value when format and children are not provided", () => {
        render(<Subject value="2026-01-15" data-testid="dt" />);

        const el: HTMLElement = screen.getByTestId("dt");
        expect(el.textContent).toBe("2026-01-15");
    });

    test("renders the format string as display text when no children", () => {
        render(
            <Subject value="2026-01-15T09:30:00Z" format="Jan 15, 2026" data-testid="dt" />,
        );

        const el: HTMLElement = screen.getByTestId("dt");
        expect(el.textContent).toBe("Jan 15, 2026");
    });

    test("children override the format prop", () => {
        render(
            <Subject value="2026-01-15T09:30:00Z" format="ignored" data-testid="dt">
                Custom
            </Subject>,
        );

        const el: HTMLElement = screen.getByTestId("dt");
        expect(el.textContent).toBe("Custom");
    });

    test("applies aria-label when label provided", () => {
        render(
            <Subject value="2026-01-15" label="Published date" data-testid="dt" />,
        );

        const el: HTMLElement = screen.getByTestId("dt");
        expect(el.getAttribute("aria-label")).toBe("Published date");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject value="2026-01-15" id="pub" data-testid="dt" />);

        const el: HTMLElement = screen.getByTestId("dt");
        expect(el.getAttribute("id")).toBe("pub");
    });
});
