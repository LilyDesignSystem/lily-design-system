import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./SplitButton.vue";


describe("SplitButton", () => {
    const baseProps = {
        label: "Save options",
        primaryLabel: "Save",
        menuLabel: "More save actions",
    };

    test("renders a group with aria-label", () => {
        render(Subject, { props: baseProps });

        const group: HTMLElement = screen.getByRole("group", { name: "Save options" });
        expect(group).toBeTruthy();
    });

    test("has split-button class on root", () => {
        render(Subject, { props: { ...baseProps, "data-testid": "sb" } });

        const el: HTMLElement = screen.getByTestId("sb");
        expect(el.classList.contains("split-button")).toBe(true);
    });

    test("renders primary button with primaryLabel text", () => {
        render(Subject, { props: baseProps });

        const button: HTMLElement = screen.getByRole("button", { name: "Save" });
        expect(button.classList.contains("split-button-primary")).toBe(true);
    });

    test("renders menu trigger with menuLabel and aria-haspopup", () => {
        render(Subject, { props: baseProps });

        const button: HTMLElement = screen.getByRole("button", { name: "More save actions" });
        expect(button.classList.contains("split-button-menu-trigger")).toBe(true);
        expect(button.getAttribute("aria-haspopup")).toBe("menu");
    });

    test("aria-expanded reflects menuOpen", () => {
        const { rerender } = render(Subject, { props: baseProps });

        const trigger: HTMLElement = screen.getByRole("button", { name: "More save actions" });
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        return rerender({ ...baseProps, menuOpen: true }).then(() => {
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
        });
    });

    test("menu container is hidden when menuOpen is false", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { default: "<button>Save and close</button>" },
        });

        const menu = container.querySelector(".split-button-menu");
        expect(menu).toBeTruthy();
        expect((menu as HTMLElement).hasAttribute("hidden")).toBe(true);
    });

    test("menu container is visible when menuOpen is true", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, menuOpen: true },
            slots: { default: "<button>Save and close</button>" },
        });

        const menu = container.querySelector(".split-button-menu");
        expect((menu as HTMLElement).hasAttribute("hidden")).toBe(false);
    });

    test("renders menu slot content", () => {
        render(Subject, {
            props: { ...baseProps, menuOpen: true },
            slots: { default: "<button>Save and close</button>" },
        });

        expect(screen.getByRole("button", { name: "Save and close" })).toBeTruthy();
    });

    test("disabled disables both buttons", () => {
        render(Subject, { props: { ...baseProps, disabled: true } });

        const primary: HTMLButtonElement = screen.getByRole("button", { name: "Save" }) as HTMLButtonElement;
        const trigger: HTMLButtonElement = screen.getByRole("button", { name: "More save actions" }) as HTMLButtonElement;
        expect(primary.disabled).toBe(true);
        expect(trigger.disabled).toBe(true);
    });

    test("emits primaryClick when the primary button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const onPrimaryClick = vi.fn();
        render(Subject, { props: { ...baseProps, onPrimaryClick } });

        await user.click(screen.getByRole("button", { name: "Save" }));
        expect(onPrimaryClick).toHaveBeenCalledOnce();
    });

    test("emits menuToggle when the menu trigger is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const onMenuToggle = vi.fn();
        render(Subject, { props: { ...baseProps, onMenuToggle } });

        await user.click(screen.getByRole("button", { name: "More save actions" }));
        expect(onMenuToggle).toHaveBeenCalledOnce();
    });

    test("data-menu-open mirrors menuOpen", () => {
        render(Subject, { props: { ...baseProps, menuOpen: true, "data-testid": "sb" } });

        const el: HTMLElement = screen.getByTestId("sb");
        expect(el.getAttribute("data-menu-open")).toBe("true");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { ...baseProps, id: "split-1", "data-testid": "sb" } });

        const el: HTMLElement = screen.getByTestId("sb");
        expect(el.getAttribute("id")).toBe("split-1");
    });
});
