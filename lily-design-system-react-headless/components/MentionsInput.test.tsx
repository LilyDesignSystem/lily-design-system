import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./MentionsInput";

describe("MentionsInput", () => {
    test("renders an input with role=combobox and required aria-label", () => {
        render(
            <Subject label="Comment">
                <ul>suggestions</ul>
            </Subject>
        );

        const input: HTMLElement = screen.getByRole("combobox");
        expect(input.tagName).toBe("INPUT");
        expect(input.getAttribute("aria-label")).toBe("Comment");
    });

    test("applies the mentions-input root class", () => {
        const { container } = render(
            <Subject label="C">
                <ul>x</ul>
            </Subject>
        );

        const root: HTMLElement = container.querySelector(".mentions-input") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("sets aria-haspopup=listbox and aria-autocomplete=list", () => {
        render(
            <Subject label="C">
                <ul>x</ul>
            </Subject>
        );

        const input: HTMLElement = screen.getByRole("combobox");
        expect(input.getAttribute("aria-haspopup")).toBe("listbox");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
    });

    test("aria-expanded reflects expanded prop", () => {
        const { rerender } = render(
            <Subject label="C" expanded={false}>
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("false");

        rerender(
            <Subject label="C" expanded={true}>
                <ul>x</ul>
            </Subject>
        );
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("default trigger char is @", () => {
        const { container } = render(
            <Subject label="C">
                <ul>x</ul>
            </Subject>
        );

        const root: HTMLElement = container.querySelector(".mentions-input") as HTMLElement;
        expect(root.getAttribute("data-trigger-char")).toBe("@");
    });

    test("supports custom trigger char", () => {
        const { container } = render(
            <Subject label="C" triggerChar="#">
                <ul>x</ul>
            </Subject>
        );

        const root: HTMLElement = container.querySelector(".mentions-input") as HTMLElement;
        expect(root.getAttribute("data-trigger-char")).toBe("#");
    });

    test("hides the suggestions panel when not expanded", () => {
        const { container } = render(
            <Subject label="C" expanded={false}>
                <ul>x</ul>
            </Subject>
        );

        const panel: HTMLElement = container.querySelector(".mentions-input-suggestions") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("shows the suggestions panel when expanded", () => {
        const { container } = render(
            <Subject label="C" expanded={true}>
                <ul>x</ul>
            </Subject>
        );

        const panel: HTMLElement = container.querySelector(".mentions-input-suggestions") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("renders the value", () => {
        render(
            <Subject label="C" value="hello @">
                <ul>x</ul>
            </Subject>
        );

        const input: HTMLInputElement = screen.getByRole("combobox") as HTMLInputElement;
        expect(input.value).toBe("hello @");
    });

    test("can be disabled", () => {
        render(
            <Subject label="C" disabled>
                <ul>x</ul>
            </Subject>
        );

        const input: HTMLInputElement = screen.getByRole("combobox") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("invokes onInput when typing", async () => {
        const user: UserEvent = userEvent.setup();
        const handleInput = vi.fn();
        render(
            <Subject label="C" onInput={handleInput}>
                <ul>x</ul>
            </Subject>
        );

        await user.type(screen.getByRole("combobox"), "a");
        expect(handleInput).toHaveBeenCalled();
    });
});
