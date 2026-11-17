import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TimelineList.vue";

describe("TimelineList", () => {
    test("renders an ordered list element", () => {
        render(Subject, { props: { label: "Project milestones" }, slots: { default: "events" } });

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Activity history" }, slots: { default: "events" } });

        const list = screen.getByRole("list");
        expect(list.getAttribute("aria-label")).toBe("Activity history");
    });

    test("renders children content", () => {
        render(Subject, { props: { label: "Timeline" }, slots: { default: "Event details here" } });

        const list = screen.getByRole("list");
        expect(list.textContent).toContain("Event details here");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Timeline", "data-testid": "my-timeline" },
            slots: { default: "events" },
        });

        const list = screen.getByTestId("my-timeline");
        expect(list).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, {
            props: { label: "Timeline", id: "project-timeline" },
            slots: { default: "events" },
        });

        const list = screen.getByRole("list");
        expect(list.getAttribute("id")).toBe("project-timeline");
    });

    test("coverageLabel says what the list is a view of, as its first item", () => {
        const { container } = render(Subject, {
            props: {
                label: "History",
                coverageLabel: "Last 12 months, newest first. The GP record did not answer.",
            },
        });
        const first = container.querySelector(".timeline-list")!.firstElementChild!;
        expect(first.tagName).toBe("LI");
        expect(first.className).toBe("timeline-list-coverage");
        expect(first.textContent?.trim()).toBe(
            "Last 12 months, newest first. The GP record did not answer.",
        );
    });
});
