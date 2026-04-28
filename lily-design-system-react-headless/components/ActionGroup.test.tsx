import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionGroup";

describe("ActionGroup", () => {
    test("renders as a group with the required aria-label", () => {
        render(<Subject label="Editor actions" />);

        const group: HTMLElement = screen.getByRole("group", { name: "Editor actions" });
        expect(group).toBeTruthy();
        expect(group.getAttribute("aria-label")).toBe("Editor actions");
    });

    test("applies the action-group root class", () => {
        render(<Subject label="Editor actions" />);

        const group: HTMLElement = screen.getByRole("group");
        expect(group.className.includes("action-group")).toBe(true);
    });

    test("renders the visible children action buttons", () => {
        render(
            <Subject label="Editor actions">
                <button type="button">Bold</button>
                <button type="button">Italic</button>
            </Subject>
        );

        expect(screen.getByRole("button", { name: "Bold" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Italic" })).toBeTruthy();
    });

    test("does not render overflow trigger when overflow is not provided", () => {
        render(
            <Subject label="Editor actions">
                <button type="button">Bold</button>
            </Subject>
        );

        expect(screen.queryByRole("button", { name: /more/i })).toBeNull();
    });

    test("renders overflow trigger and menu when overflow is provided", () => {
        render(
            <Subject
            label="Editor actions"
            overflowLabel="More actions"
            overflow={<button type="button">Underline</button>}
            >
                <button type="button">Bold</button>
            </Subject>
        );

        const trigger: HTMLElement = screen.getByRole("button", { name: "More actions" });
        expect(trigger).toBeTruthy();
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("overflow trigger reflects overflowOpen via aria-expanded", () => {
        render(
            <Subject
            label="Editor actions"
            overflowLabel="More actions"
            overflowOpen
            overflow={<button type="button">Underline</button>}
            />
        );

        const trigger: HTMLElement = screen.getByRole("button", { name: "More actions" });
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("overflow menu is hidden when overflowOpen is false", () => {
        const { container } = render(
            <Subject
            label="Editor actions"
            overflowLabel="More actions"
            overflow={<button type="button">Underline</button>}
            />
        );

        const menu: HTMLElement | null = container.querySelector(".action-group-overflow-menu");
        expect(menu).toBeTruthy();
        expect((menu as HTMLElement).hasAttribute("hidden")).toBe(true);
    });

    test("overflow menu is visible when overflowOpen is true", () => {
        const { container } = render(
            <Subject
            label="Editor actions"
            overflowLabel="More actions"
            overflowOpen
            overflow={<button type="button">Underline</button>}
            />
        );

        const menu: HTMLElement | null = container.querySelector(".action-group-overflow-menu");
        expect(menu).toBeTruthy();
        expect((menu as HTMLElement).hasAttribute("hidden")).toBe(false);
    });

    test("calls onOverflowToggle when the overflow trigger is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleToggle = vi.fn();
        render(
            <Subject
            label="Editor actions"
            overflowLabel="More actions"
            onOverflowToggle={handleToggle}
            overflow={<button type="button">Underline</button>}
            />
        );

        await user.click(screen.getByRole("button", { name: "More actions" }));
        expect(handleToggle).toHaveBeenCalledOnce();
    });
});
