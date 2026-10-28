import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TimelineList";

describe("TimelineList", () => {
    test("renders an ordered list element", () => {
        render(<Subject label="Project milestones">events</Subject>);

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    test("has aria-label from label prop", () => {
        render(<Subject label="Activity history">events</Subject>);

        const list = screen.getByRole("list");
        expect(list.getAttribute("aria-label")).toBe("Activity history");
    });

    test("renders children content", () => {
        render(<Subject label="Timeline">Event details here</Subject>);

        const list = screen.getByRole("list");
        expect(list.textContent).toContain("Event details here");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Timeline"
                data-testid="my-timeline"
            >
                events
            </Subject>,
        );

        const list = screen.getByTestId("my-timeline");
        expect(list).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(
            <Subject
                label="Timeline"
                id="project-timeline"
            >
                events
            </Subject>,
        );

        const list = screen.getByRole("list");
        expect(list.getAttribute("id")).toBe("project-timeline");
    });
});
