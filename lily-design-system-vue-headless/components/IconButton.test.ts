import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./IconButton.vue";


describe("IconButton", () => {
    test("renders as a button with aria-label", () => {
        render(Subject, { props: { label: "Close" }, slots: { default: "×" } });

        const button: HTMLElement = screen.getByRole("button", { name: "Close" });
        expect(button).toBeTruthy();
    });

    test("has icon-button class on root", () => {
        render(Subject, { props: { label: "Close" }, slots: { default: "×" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.classList.contains("icon-button")).toBe(true);
    });

    test("renders icon content from slot", () => {
        render(Subject, { props: { label: "Save" }, slots: { default: "💾" } });

        expect(screen.getByText("💾")).toBeTruthy();
    });

    test("requires label prop and applies it as aria-label", () => {
        render(Subject, { props: { label: "Close dialog" }, slots: { default: "×" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-label")).toBe("Close dialog");
    });

    test("defaults to type button", () => {
        render(Subject, { props: { label: "Close" }, slots: { default: "×" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("accepts submit type", () => {
        render(Subject, { props: { label: "Submit", type: "submit" }, slots: { default: "→" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("submit");
    });

    test("can be disabled", () => {
        render(Subject, { props: { label: "Close", disabled: true }, slots: { default: "×" } });

        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("emits click on activation", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(Subject, {
            props: { label: "Close", onClick },
            slots: { default: "×" },
        });

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("supports aria-pressed for toggle", () => {
        render(Subject, { props: { label: "Bold", pressed: true }, slots: { default: "B" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBe("true");
    });

    test("does not have aria-pressed when not a toggle", () => {
        render(Subject, { props: { label: "Close" }, slots: { default: "×" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Close", id: "btn-close" },
            slots: { default: "×" },
        });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("id")).toBe("btn-close");
    });
});
