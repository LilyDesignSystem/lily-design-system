import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ContextualHelp";

describe("ContextualHelp", () => {
    test("applies the contextual-help root class", () => {
        const { container } = render(<Subject label="Help" triggerLabel="?">Content</Subject>);

        const root: HTMLElement | null = container.querySelector(".contextual-help");
        expect(root).toBeTruthy();
    });

    test("renders the trigger button with the required aria-label", () => {
        render(<Subject label="Show help"
                triggerLabel="?">Content</Subject>);

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        expect(trigger).toBeTruthy();
    });

    test("trigger has aria-haspopup, aria-expanded, and aria-controls", () => {
        render(<Subject label="Show help"
                triggerLabel="?">Content</Subject>);

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(trigger.getAttribute("aria-controls")).toBeTruthy();
    });

    test("aria-controls points to the rendered panel id", () => {
        render(
            <Subject
                label="Show help"
                triggerLabel="?"
                expanded
            >
                Content
            </Subject>,
        );

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        const controls: string | null = trigger.getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        const panel: Element | null = document.querySelector(`[id="${controls}"]`);
        expect(panel).toBeTruthy();
        expect(panel?.getAttribute("role")).toBe("dialog");
    });

    test("panel is hidden when expanded is false", () => {
        const { container } = render(<Subject label="Show help"
                triggerLabel="?">Content</Subject>);

        const panel: HTMLElement | null = container.querySelector(".contextual-help-panel");
        expect(panel).toBeTruthy();
        expect((panel as HTMLElement).hasAttribute("hidden")).toBe(true);
    });

    test("panel is visible when expanded is true", () => {
        const { container } = render(
            <Subject
                label="Show help"
                triggerLabel="?"
                expanded
            >
                Content
            </Subject>,
        );

        const panel: HTMLElement | null = container.querySelector(".contextual-help-panel");
        expect(panel).toBeTruthy();
        expect((panel as HTMLElement).hasAttribute("hidden")).toBe(false);
    });

    test("aria-expanded reflects the expanded prop", () => {
        render(
            <Subject
                label="Show help"
                triggerLabel="?"
                expanded
            >
                Content
            </Subject>,
        );

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("renders children inside the panel", () => {
        render(
            <Subject
                label="Show help"
                triggerLabel="?"
                expanded
            >
                Helpful info
            </Subject>,
        );

        expect(screen.getByText("Helpful info")).toBeTruthy();
    });

    test("calls onClick when the trigger is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Subject
                label="Show help"
                triggerLabel="?"
                onClick={handleClick}
            >
                Content
            </Subject>,
        );

        await user.click(screen.getByRole("button", { name: "Show help" }));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("renders triggerLabel as the visible text, with label as the accessible name", () => {
        render(
            <Subject
                label="Show help"
                triggerLabel="؟"
            >
                Content
            </Subject>,
        );

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        expect(trigger.textContent).toBe("؟");
    });

    test("trigger names the panel with command/commandfor and popovertarget", () => {
        const { container } = render(
            <Subject
                label="Show help"
                triggerLabel="?"
            >
                Content
            </Subject>,
        );

        const trigger = container.querySelector(".contextual-help-trigger") as HTMLElement;
        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        expect(trigger.getAttribute("command")).toBe("toggle-popover");
        expect(trigger.getAttribute("commandfor")).toBe(panel.id);
        expect(trigger.getAttribute("popovertarget")).toBe(panel.id);
    });

    test("without the Popover API, clicking toggles the panel and calls onChange", async () => {
        const user: UserEvent = userEvent.setup();
        const handleChange = vi.fn();
        const { container } = render(
            <Subject
                label="Show help"
                triggerLabel="?"
                onChange={handleChange}
            >
                Content
            </Subject>,
        );

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        await user.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hasAttribute("hidden")).toBe(false);
        expect(handleChange).toHaveBeenLastCalledWith(true);
        await user.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("onClick calling preventDefault stops the toggle", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Show help"
                triggerLabel="?"
                onClick={(event) => event.preventDefault()}
            >
                Content
            </Subject>,
        );

        const trigger: HTMLElement = screen.getByRole("button", { name: "Show help" });
        await user.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });
});
