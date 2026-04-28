import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TabPanel";

describe("TabPanel", () => {
    test("renders with role tabpanel", () => {
        render(<Subject label="Details" selected>Content</Subject>);

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel).toBeTruthy();
    });

    test("applies the tab-panel root class", () => {
        render(<Subject label="Details" selected>Content</Subject>);

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.className.includes("tab-panel")).toBe(true);
    });

    test("uses aria-label when labelledBy is not provided", () => {
        render(<Subject label="Details" selected>Content</Subject>);

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.getAttribute("aria-label")).toBe("Details");
        expect(panel.getAttribute("aria-labelledby")).toBeNull();
    });

    test("uses aria-labelledby when provided and omits aria-label", () => {
        render(
            <Subject label="Details" labelledBy="tab-1" selected>
                Content
            </Subject>
        );

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.getAttribute("aria-labelledby")).toBe("tab-1");
        expect(panel.getAttribute("aria-label")).toBeNull();
    });

    test("is hidden when not selected", () => {
        render(<Subject label="Details">Content</Subject>);

        const panel: HTMLElement = screen.getByRole("tabpanel", { hidden: true });
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("is visible when selected", () => {
        render(<Subject label="Details" selected>Content</Subject>);

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("has tabindex 0 for keyboard focusability", () => {
        render(<Subject label="Details" selected>Content</Subject>);

        const panel: HTMLElement = screen.getByRole("tabpanel");
        expect(panel.getAttribute("tabindex")).toBe("0");
    });

    test("renders children", () => {
        render(<Subject label="Details" selected>Hello panel</Subject>);

        expect(screen.getByText("Hello panel")).toBeTruthy();
    });
});
