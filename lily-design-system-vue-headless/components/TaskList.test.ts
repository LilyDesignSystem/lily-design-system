import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TaskList.vue";

describe("TaskList", () => {
    test("renders an ordered list element", () => {
        render(Subject, { props: { label: "Tasks" }, slots: { default: "items" } });

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    test("has role list", () => {
        render(Subject, { props: { label: "Tasks" }, slots: { default: "items" } });

        const list = screen.getByRole("list");
        expect(list.getAttribute("role")).toBe("list");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Today's tasks" }, slots: { default: "items" } });

        const list = screen.getByRole("list");
        expect(list.getAttribute("aria-label")).toBe("Today's tasks");
    });

    test("renders children content", () => {
        render(Subject, { props: { label: "Tasks" }, slots: { default: "Review code" } });

        const list = screen.getByRole("list");
        expect(list.textContent).toContain("Review code");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Tasks", "data-testid": "my-tasks" },
            slots: { default: "items" },
        });

        const list = screen.getByTestId("my-tasks");
        expect(list).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, {
            props: { label: "Tasks", id: "task-list-1" },
            slots: { default: "items" },
        });

        const list = screen.getByRole("list");
        expect(list.getAttribute("id")).toBe("task-list-1");
    });
});
