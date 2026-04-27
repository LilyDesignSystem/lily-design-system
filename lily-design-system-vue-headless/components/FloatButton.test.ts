import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FloatButton.vue";


describe("FloatButton", () => {
    test("renders as a button with float-button class and aria-label", () => {
        render(Subject, { props: { label: "Help" }, slots: { default: "?" } });

        const button: HTMLElement = screen.getByRole("button", { name: "Help" });
        expect(button.classList.contains("float-button")).toBe(true);
    });

    test("defaults to type button", () => {
        render(Subject, { props: { label: "Help" }, slots: { default: "?" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("accepts type submit", () => {
        render(Subject, { props: { label: "Submit", type: "submit" }, slots: { default: "→" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("submit");
    });

    test("can be disabled", () => {
        render(Subject, { props: { label: "Help", disabled: true }, slots: { default: "?" } });

        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("defaults to bottom-right position with fixed style", () => {
        render(Subject, { props: { label: "Help" }, slots: { default: "?" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("data-position")).toBe("bottom-right");
        expect(button.style.position).toBe("fixed");
        expect(button.style.bottom).toBe("1rem");
        expect(button.style.right).toBe("1rem");
    });

    test("applies top-left corner offsets", () => {
        render(Subject, { props: { label: "Help", position: "top-left" }, slots: { default: "?" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("data-position")).toBe("top-left");
        expect(button.style.top).toBe("1rem");
        expect(button.style.left).toBe("1rem");
    });

    test("applies top-right corner offsets", () => {
        render(Subject, { props: { label: "Help", position: "top-right" }, slots: { default: "?" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.style.top).toBe("1rem");
        expect(button.style.right).toBe("1rem");
    });

    test("applies bottom-left corner offsets", () => {
        render(Subject, { props: { label: "Help", position: "bottom-left" }, slots: { default: "?" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.style.bottom).toBe("1rem");
        expect(button.style.left).toBe("1rem");
    });

    test("renders icon content from slot", () => {
        render(Subject, { props: { label: "Add" }, slots: { default: "+" } });

        expect(screen.getByText("+")).toBeTruthy();
    });

    test("emits click on activation", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(Subject, { props: { label: "Help", onClick }, slots: { default: "?" } });

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(onClick).toHaveBeenCalledOnce();
    });
});
