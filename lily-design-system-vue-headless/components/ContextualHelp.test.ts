import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ContextualHelp.vue";


describe("ContextualHelp", () => {
    test("has contextual-help class on root", () => {
        const { container } = render(Subject, {
            props: { label: "Help" },
            slots: { default: "<p>Help text</p>" },
        });

        const root = container.firstElementChild as HTMLElement;
        expect(root.classList.contains("contextual-help")).toBe(true);
    });

    test("renders trigger button with aria-label", () => {
        render(Subject, {
            props: { label: "Help" },
            slots: { default: "<p>Help text</p>" },
        });

        const trigger: HTMLElement = screen.getByRole("button", { name: "Help" });
        expect(trigger).toBeTruthy();
        expect(trigger.classList.contains("contextual-help-trigger")).toBe(true);
    });

    test("trigger has aria-haspopup dialog", () => {
        render(Subject, {
            props: { label: "Help" },
            slots: { default: "<p>Help text</p>" },
        });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    });

    test("trigger reflects expanded via aria-expanded (closed)", () => {
        render(Subject, {
            props: { label: "Help", expanded: false },
            slots: { default: "<p>Help text</p>" },
        });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("trigger reflects expanded via aria-expanded (open)", () => {
        render(Subject, {
            props: { label: "Help", expanded: true },
            slots: { default: "<p>Help text</p>" },
        });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("aria-controls matches the panel id", () => {
        render(Subject, {
            props: { label: "Help", expanded: true },
            slots: { default: "<p>Help text</p>" },
        });

        const trigger: HTMLElement = screen.getByRole("button");
        const panel: HTMLElement = screen.getByRole("dialog");
        expect(trigger.getAttribute("aria-controls")).toBe(panel.getAttribute("id"));
    });

    test("panel is hidden when expanded is false", () => {
        render(Subject, {
            props: { label: "Help", expanded: false },
            slots: { default: "<p>Help text</p>" },
        });

        const panel: HTMLElement = screen.getByRole("dialog", { hidden: true });
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("panel renders slot content when expanded", () => {
        render(Subject, {
            props: { label: "Help", expanded: true },
            slots: { default: "<p>Help text body</p>" },
        });

        expect(screen.getByText("Help text body")).toBeTruthy();
    });

    test("emits click when trigger is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(Subject, {
            props: { label: "Help", onClick },
            slots: { default: "<p>Help text</p>" },
        });

        await user.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
