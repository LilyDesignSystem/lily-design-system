import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TimelineListItem";

describe("TimelineListItem", () => {
    test("renders a list item", () => {
        render(<Subject>Order placed</Subject>);
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(<Subject>Order shipped</Subject>);
        expect(screen.getByText("Order shipped")).toBeTruthy();
    });

    test("renders time element with datetime and heading", () => {
        render(
            <Subject
                datetime="2024-01-15"
                heading="January 15, 2024"
            >
                Order placed
            </Subject>,
        );
        const time = screen.getByText("January 15, 2024");
        expect(time.tagName).toBe("TIME");
        expect(time.getAttribute("datetime")).toBe("2024-01-15");
    });

    test("renders time element with heading only", () => {
        render(<Subject heading="Last week">Event happened</Subject>);
        const time = screen.getByText("Last week");
        expect(time.tagName).toBe("TIME");
    });

    test("renders time element with datetime only", () => {
        render(<Subject datetime="2024-06-01">Milestone reached</Subject>);
        const li = screen.getByRole("listitem");
        const time = li.querySelector("time");
        expect(time).toBeTruthy();
        expect(time!.getAttribute("datetime")).toBe("2024-06-01");
    });

    test("does not render time element when no datetime or heading", () => {
        render(<Subject>Simple event</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.querySelector("time")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject data-testid="tl-item">Event</Subject>);
        expect(screen.getByTestId("tl-item")).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(<Subject id="event-1">Event</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("event-1");
    });
});
