import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TabPanel.vue";


describe("TabPanel", () => {
    test("renders as a tabpanel", () => {
        render(Subject, {
            props: { label: "Details", selected: true },
            slots: { default: "<p>panel content</p>" },
        });

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel).toBeTruthy();
    });

    test("has tab-panel class on root", () => {
        render(Subject, {
            props: { label: "Details", selected: true },
            slots: { default: "<p>panel content</p>" },
        });

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.classList.contains("tab-panel")).toBe(true);
    });

    test("uses aria-label when labelledBy is not provided", () => {
        render(Subject, {
            props: { label: "Details", selected: true },
            slots: { default: "<p>panel content</p>" },
        });

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.getAttribute("aria-label")).toBe("Details");
        expect(panel.getAttribute("aria-labelledby")).toBeNull();
    });

    test("uses aria-labelledby and omits aria-label when labelledBy is provided", () => {
        render(Subject, {
            props: { label: "Details", labelledBy: "tab-1", selected: true },
            slots: { default: "<p>panel content</p>" },
        });

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.getAttribute("aria-labelledby")).toBe("tab-1");
        expect(panel.getAttribute("aria-label")).toBeNull();
    });

    test("is hidden when selected is false", () => {
        render(Subject, {
            props: { label: "Details", selected: false },
            slots: { default: "<p>panel content</p>" },
        });

        const panel: HTMLElement = screen.getByRole("tabpanel", { hidden: true });
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("is visible when selected is true", () => {
        render(Subject, {
            props: { label: "Details", selected: true },
            slots: { default: "<p>panel content</p>" },
        });

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("has tabindex 0", () => {
        render(Subject, {
            props: { label: "Details", selected: true },
            slots: { default: "<p>panel content</p>" },
        });

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.getAttribute("tabindex")).toBe("0");
    });

    test("renders default slot content", () => {
        render(Subject, {
            props: { label: "Details", selected: true },
            slots: { default: "<p>panel content here</p>" },
        });

        expect(screen.getByText("panel content here")).toBeTruthy();
    });
});
