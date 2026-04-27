import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./MentionsInput.vue";


describe("MentionsInput", () => {
    test("renders root with mentions-input class", () => {
        const { container } = render(Subject, { props: { label: "Reply" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("mentions-input")).toBe(true);
    });

    test("default trigger char is @", () => {
        const { container } = render(Subject, { props: { label: "Reply" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-trigger-char")).toBe("@");
    });

    test("custom trigger char", () => {
        const { container } = render(Subject, { props: { label: "Reply", triggerChar: "#" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-trigger-char")).toBe("#");
    });

    test("inner input has combobox role and aria-label", () => {
        render(Subject, { props: { label: "Reply" } });

        const input: HTMLElement = screen.getByRole("combobox", { name: "Reply" });
        expect(input.tagName).toBe("INPUT");
    });

    test("input has aria-haspopup listbox and aria-autocomplete list", () => {
        render(Subject, { props: { label: "Reply" } });

        const input: HTMLElement = screen.getByRole("combobox");
        expect(input.getAttribute("aria-haspopup")).toBe("listbox");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
    });

    test("aria-expanded reflects expanded prop", () => {
        render(Subject, { props: { label: "Reply", expanded: true } });

        const input: HTMLElement = screen.getByRole("combobox");
        expect(input.getAttribute("aria-expanded")).toBe("true");
    });

    test("input value is bound", () => {
        render(Subject, { props: { label: "Reply", value: "Hello @bob" } });

        const input: HTMLInputElement = screen.getByRole("combobox") as HTMLInputElement;
        expect(input.value).toBe("Hello @bob");
    });

    test("placeholder is applied", () => {
        render(Subject, { props: { label: "Reply", placeholder: "Type @ to mention…" } });

        const input: HTMLElement = screen.getByRole("combobox");
        expect(input.getAttribute("placeholder")).toBe("Type @ to mention…");
    });

    test("input can be disabled", () => {
        render(Subject, { props: { label: "Reply", disabled: true } });

        const input: HTMLInputElement = screen.getByRole("combobox") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("renders suggestions slot content", () => {
        const { container } = render(Subject, {
            props: { label: "Reply", expanded: true },
            slots: { default: "<ul role=\"listbox\"><li>alice</li></ul>" },
        });

        expect(container.textContent).toContain("alice");
    });

    test("suggestions panel is hidden when not expanded", () => {
        const { container } = render(Subject, { props: { label: "Reply" } });

        const panel: HTMLElement = container.querySelector(".mentions-input-suggestions") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("emits input event on typing", async () => {
        const user: UserEvent = userEvent.setup();
        const onInput = vi.fn();
        render(Subject, { props: { label: "Reply", onInput } });

        const input: HTMLElement = screen.getByRole("combobox");
        await user.type(input, "a");
        expect(onInput).toHaveBeenCalled();
    });
});
