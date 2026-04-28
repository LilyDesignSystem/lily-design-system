import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ContextualHelp";

describe("ContextualHelp", () => {
    test("applies the contextual-help root class", () => {
        const { container } = render(<Subject label="Help">Content</Subject>);

        const root: HTMLElement | null = container.querySelector(".contextual-help");
        expect(root).toBeTruthy();
    });

    test("renders the trigger button with the required aria-label", () => {
        render(<Subject label="Show help">Content</Subject>);

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        expect(trigger).toBeTruthy();
    });

    test("trigger has aria-haspopup, aria-expanded, and aria-controls", () => {
        render(<Subject label="Show help">Content</Subject>);

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(trigger.getAttribute("aria-controls")).toBeTruthy();
    });

    test("aria-controls points to the rendered panel id", () => {
        render(<Subject label="Show help" expanded>Content</Subject>);

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        const controls: string | null = trigger.getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        const panel: Element | null = document.querySelector(`[id="${controls}"]`);
        expect(panel).toBeTruthy();
        expect(panel?.getAttribute("role")).toBe("dialog");
    });

    test("panel is hidden when expanded is false", () => {
        const { container } = render(<Subject label="Show help">Content</Subject>);

        const panel: HTMLElement | null = container.querySelector(".contextual-help-panel");
        expect(panel).toBeTruthy();
        expect((panel as HTMLElement).hasAttribute("hidden")).toBe(true);
    });

    test("panel is visible when expanded is true", () => {
        const { container } = render(<Subject label="Show help" expanded>Content</Subject>);

        const panel: HTMLElement | null = container.querySelector(".contextual-help-panel");
        expect(panel).toBeTruthy();
        expect((panel as HTMLElement).hasAttribute("hidden")).toBe(false);
    });

    test("aria-expanded reflects the expanded prop", () => {
        render(<Subject label="Show help" expanded>Content</Subject>);

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("renders children inside the panel", () => {
        render(<Subject label="Show help" expanded>Helpful info</Subject>);

        expect(screen.getByText("Helpful info")).toBeTruthy();
    });

    test("calls onClick when the trigger is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(<Subject label="Show help" onClick={handleClick}>Content</Subject>);

        await user.click(screen.getByRole("button", { name: "Show help" }));
        expect(handleClick).toHaveBeenCalledOnce();
    });
});
