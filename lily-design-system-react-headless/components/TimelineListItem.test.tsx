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

    test("withheld keeps the date and shows only the words; entered-in-error strikes the content through", () => {
        const { container, unmount } = render(
            <Subject datetime="2026-11-03" heading="3 Nov 2026" entryState="withheld" entryStateLabel="Restricted">
                Sensitive note
            </Subject>,
        );
        let li = container.querySelector("li.timeline-list-item")!;
        expect(li.getAttribute("data-entry-state")).toBe("withheld");
        expect(li.querySelector("time")?.textContent).toBe("3 Nov 2026");
        expect(li.textContent).not.toContain("Sensitive note");
        unmount();
        const second = render(
            <Subject entryState="entered-in-error" entryStateLabel="Entered in error">
                Wrong patient
            </Subject>,
        );
        li = second.container.querySelector("li.timeline-list-item")!;
        expect(li.querySelector("del.timeline-list-item-entry")?.textContent).toBe("Wrong patient");
        expect(li.querySelector(".timeline-list-item-entry-state")?.textContent).toBe("Entered in error");
    });
});
