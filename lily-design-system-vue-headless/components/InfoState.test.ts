import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./InfoState.vue";


describe("InfoState", () => {
    test("renders a section with role status", () => {
        render(Subject, { props: { title: "No tasks" } });

        const section: HTMLElement = screen.getByRole("status");
        expect(section.tagName).toBe("SECTION");
    });

    test("has info-state class on root", () => {
        render(Subject, { props: { title: "No tasks" } });

        const section: HTMLElement = screen.getByRole("status");
        expect(section.classList.contains("info-state")).toBe(true);
    });

    test("renders the title in an h2", () => {
        render(Subject, { props: { title: "No tasks" } });

        const heading: HTMLElement = screen.getByRole("heading", { level: 2 });
        expect(heading.textContent).toBe("No tasks");
    });

    test("renders description when provided", () => {
        render(Subject, { props: { title: "No tasks", description: "Create one" } });

        expect(screen.getByText("Create one")).toBeTruthy();
    });

    test("does not render description when not provided", () => {
        const { container } = render(Subject, { props: { title: "No tasks" } });

        expect(container.querySelector(".info-state-description")).toBeNull();
    });

    test("defaults to level info", () => {
        render(Subject, { props: { title: "No tasks" } });

        const section: HTMLElement = screen.getByRole("status");
        expect(section.getAttribute("data-level")).toBe("info");
    });

    test("accepts custom level", () => {
        render(Subject, { props: { title: "Failed", level: "error" } });

        const section: HTMLElement = screen.getByRole("status");
        expect(section.getAttribute("data-level")).toBe("error");
    });

    test("aria-label defaults to title", () => {
        render(Subject, { props: { title: "No tasks" } });

        const section: HTMLElement = screen.getByRole("status");
        expect(section.getAttribute("aria-label")).toBe("No tasks");
    });

    test("aria-label can be overridden via label prop", () => {
        render(Subject, { props: { title: "No tasks", label: "Empty list" } });

        const section: HTMLElement = screen.getByRole("status");
        expect(section.getAttribute("aria-label")).toBe("Empty list");
    });

    test("renders illustration slot when provided", () => {
        render(Subject, {
            props: { title: "No tasks" },
            slots: { illustration: "<svg data-testid=\"illo\"></svg>" },
        });

        expect(screen.getByTestId("illo")).toBeTruthy();
    });

    test("renders action slot when provided", () => {
        render(Subject, {
            props: { title: "No tasks" },
            slots: { action: "<button>Create</button>" },
        });

        expect(screen.getByRole("button", { name: "Create" })).toBeTruthy();
    });

    test("default slot replaces title/description structure", () => {
        render(Subject, {
            props: { title: "Ignored" },
            slots: { default: "<p>Custom content</p>" },
        });

        expect(screen.getByText("Custom content")).toBeTruthy();
        expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { title: "No tasks", id: "empty-state" } });

        const section: HTMLElement = screen.getByRole("status");
        expect(section.getAttribute("id")).toBe("empty-state");
    });
});
