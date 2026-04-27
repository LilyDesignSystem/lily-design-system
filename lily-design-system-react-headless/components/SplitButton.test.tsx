import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./SplitButton";

function renderDefault(props: Partial<ComponentProps<typeof Subject>> = {}) {
    return render(
        <Subject
            label="Save options"
            primaryLabel="Save"
            menuLabel="More save options"
            {...props}
        />,
    );
}

describe("SplitButton", () => {
    test("renders a role=group with aria-label", () => {
        renderDefault();

        const group: HTMLElement = screen.getByRole("group", { name: "Save options" });
        expect(group.className.includes("split-button")).toBe(true);
    });

    test("renders the primary button with primaryLabel", () => {
        renderDefault();

        const primary: HTMLElement = screen.getByRole("button", { name: "Save" });
        expect(primary.className.includes("split-button-primary")).toBe(true);
        expect(primary.getAttribute("type")).toBe("button");
    });

    test("renders the menu trigger with aria-label and aria-haspopup=menu", () => {
        renderDefault();

        const trigger: HTMLElement = screen.getByRole("button", { name: "More save options" });
        expect(trigger.className.includes("split-button-menu-trigger")).toBe(true);
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("aria-expanded reflects menuOpen", () => {
        renderDefault({ menuOpen: true });

        const trigger: HTMLElement = screen.getByRole("button", { name: "More save options" });
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("menu container is hidden when menuOpen is false", () => {
        const { container } = renderDefault({ children: <span>menu-item</span> });

        const menu: HTMLElement | null = container.querySelector(".split-button-menu");
        expect(menu).toBeTruthy();
        expect(menu?.hasAttribute("hidden")).toBe(true);
    });

    test("menu container is visible when menuOpen is true", () => {
        const { container } = renderDefault({
            menuOpen: true,
            children: <span>menu-item</span>,
        });

        const menu: HTMLElement | null = container.querySelector(".split-button-menu");
        expect(menu?.hasAttribute("hidden")).toBe(false);
        expect(menu?.textContent).toBe("menu-item");
    });

    test("disables both buttons when disabled is true", () => {
        renderDefault({ disabled: true });

        const primary: HTMLButtonElement = screen.getByRole("button", { name: "Save" }) as HTMLButtonElement;
        const trigger: HTMLButtonElement = screen.getByRole("button", { name: "More save options" }) as HTMLButtonElement;
        expect(primary.disabled).toBe(true);
        expect(trigger.disabled).toBe(true);
    });

    test("calls onPrimaryClick when primary button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handlePrimary = vi.fn();
        renderDefault({ onPrimaryClick: handlePrimary });

        await user.click(screen.getByRole("button", { name: "Save" }));
        expect(handlePrimary).toHaveBeenCalledOnce();
    });

    test("calls onMenuToggle when trigger is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleToggle = vi.fn();
        renderDefault({ onMenuToggle: handleToggle });

        await user.click(screen.getByRole("button", { name: "More save options" }));
        expect(handleToggle).toHaveBeenCalledOnce();
    });
});
