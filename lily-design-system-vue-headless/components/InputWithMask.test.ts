import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./InputWithMask.vue";


const baseProps = {
    label: "Phone number",
    mask: "(___) ___-____",
};


describe("InputWithMask", () => {
    test("renders a wrapper div with input-with-mask class", () => {
        const { container } = render(Subject, { props: baseProps });

        const root: HTMLElement | null = container.querySelector(".input-with-mask");
        expect(root).toBeTruthy();
    });

    test("exposes the mask via data-mask attribute on the root", () => {
        const { container } = render(Subject, { props: baseProps });

        const root: HTMLElement | null = container.querySelector(".input-with-mask");
        expect(root?.getAttribute("data-mask")).toBe(baseProps.mask);
    });

    test("renders mask display as aria-hidden", () => {
        const { container } = render(Subject, { props: baseProps });

        const display: HTMLElement | null = container.querySelector(".input-with-mask-display");
        expect(display).toBeTruthy();
        expect(display?.getAttribute("aria-hidden")).toBe("true");
        expect(display?.textContent).toBe(baseProps.mask);
    });

    test("mask display appears before the input", () => {
        const { container } = render(Subject, { props: baseProps });

        const root: HTMLElement | null = container.querySelector(".input-with-mask");
        const children: Element[] = Array.from(root?.children ?? []);
        const displayIndex: number = children.findIndex(c => c.classList.contains("input-with-mask-display"));
        const inputIndex: number = children.findIndex(c => c.classList.contains("input-with-mask-control"));
        expect(displayIndex).toBeGreaterThanOrEqual(0);
        expect(inputIndex).toBeGreaterThan(displayIndex);
    });

    test("renders an input with aria-label", () => {
        render(Subject, { props: baseProps });

        const input: HTMLElement = screen.getByRole("textbox", { name: baseProps.label });
        expect(input).toBeTruthy();
    });

    test("input has the value prop", () => {
        render(Subject, { props: { ...baseProps, value: "555" } });

        const input: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.value).toBe("555");
    });

    test("input can be disabled", () => {
        render(Subject, { props: { ...baseProps, disabled: true } });

        const input: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("input applies placeholder when provided", () => {
        render(Subject, { props: { ...baseProps, placeholder: "Enter number" } });

        const input: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.getAttribute("placeholder")).toBe("Enter number");
    });

    test("emits input event when user types", async () => {
        const user: UserEvent = userEvent.setup();
        const onInput = vi.fn();
        render(Subject, { props: { ...baseProps, onInput } });

        const input: HTMLElement = screen.getByRole("textbox");
        await user.type(input, "5");
        expect(onInput).toHaveBeenCalled();
    });
});
