import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TimelineListItem.vue";

describe("TimelineListItem", () => {
    test("renders a list item", () => {
        render(Subject, { slots: { default: "Order placed" } });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, { slots: { default: "Order shipped" } });
        expect(screen.getByText("Order shipped")).toBeTruthy();
    });

    test("renders time element with datetime and heading", () => {
        render(Subject, {
            props: { datetime: "2024-01-15", heading: "January 15, 2024" },
            slots: { default: "Order placed" },
        });
        const time = screen.getByText("January 15, 2024");
        expect(time.tagName).toBe("TIME");
        expect(time.getAttribute("datetime")).toBe("2024-01-15");
    });

    test("renders time element with heading only", () => {
        render(Subject, { props: { heading: "Last week" }, slots: { default: "Event happened" } });
        const time = screen.getByText("Last week");
        expect(time.tagName).toBe("TIME");
    });

    test("renders time element with datetime only", () => {
        render(Subject, {
            props: { datetime: "2024-06-01" },
            slots: { default: "Milestone reached" },
        });
        const li = screen.getByRole("listitem");
        const time = li.querySelector("time");
        expect(time).toBeTruthy();
        expect(time!.getAttribute("datetime")).toBe("2024-06-01");
    });

    test("does not render time element when no datetime or heading", () => {
        render(Subject, { slots: { default: "Simple event" } });
        const li = screen.getByRole("listitem");
        expect(li.querySelector("time")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "tl-item" }, slots: { default: "Event" } });
        expect(screen.getByTestId("tl-item")).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "event-1" }, slots: { default: "Event" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("event-1");
    });
});
