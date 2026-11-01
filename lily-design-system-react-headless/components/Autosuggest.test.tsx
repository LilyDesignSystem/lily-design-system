import { describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import Autosuggest from "./Autosuggest";

const fruit = [
    { value: "apple", label: "Apple" },
    { value: "apricot", label: "Apricot" },
    { value: "avocado", label: "Avocado" },
];

function setup(props: Record<string, unknown> = {}) {
    const result = render(
        <Autosuggest
            label="Fruit"
            suggestions={fruit}
            {...props}
        />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    const list = result.container.querySelector('[role="listbox"]') as HTMLElement;
    const options = () =>
        Array.from(result.container.querySelectorAll('[role="option"]')) as HTMLElement[];
    return { ...result, input, list, options };
}

describe("Autosuggest", () => {
    test("renders a div root with an input combobox and a hidden listbox", () => {
        const { container, input, list } = setup({ className: "extra" });
        const root = container.querySelector("div.autosuggest") as HTMLElement;
        expect(root.classList.contains("extra")).toBe(true);
        expect(input.getAttribute("aria-label")).toBe("Fruit");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.getAttribute("aria-controls")).toBe(list.id);
        expect(list.hidden).toBe(true);
    });

    test("typing reports the query and opens the list", () => {
        const onInput = vi.fn();
        const { input, list } = setup({ onInput });
        fireEvent.change(input, { target: { value: "ap" } });
        expect(onInput).toHaveBeenCalledWith("ap");
        expect(input.value).toBe("ap");
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(list.hidden).toBe(false);
    });

    test("the list stays closed while there are no suggestions", () => {
        const { input } = setup({ suggestions: [] });
        fireEvent.change(input, { target: { value: "zz" } });
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    test("ArrowDown and ArrowUp move the highlight, wrapping, via aria-activedescendant", () => {
        const { input, options } = setup();
        fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
        expect(options()[0].getAttribute("aria-selected")).toBe("true");
        fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[1].id);
        fireEvent.keyDown(input, { key: "ArrowUp" });
        fireEvent.keyDown(input, { key: "ArrowUp" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Home and End jump to the first and last option", () => {
        const { input, options } = setup();
        fireEvent.keyDown(input, { key: "ArrowDown" });
        fireEvent.keyDown(input, { key: "End" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        fireEvent.keyDown(input, { key: "Home" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Enter chooses the highlighted option, fills the input and closes", () => {
        const onSelect = vi.fn();
        const { input } = setup({ onSelect });
        fireEvent.keyDown(input, { key: "ArrowDown" });
        fireEvent.keyDown(input, { key: "ArrowDown" });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(onSelect).toHaveBeenCalledWith("apricot");
        expect(input.value).toBe("apricot");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("Escape closes without choosing", () => {
        const onSelect = vi.fn();
        const { input } = setup({ onSelect, defaultValue: "ap" });
        fireEvent.keyDown(input, { key: "ArrowDown" });
        fireEvent.keyDown(input, { key: "Escape" });
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(onSelect).not.toHaveBeenCalled();
        expect(input.value).toBe("ap");
    });

    test("pressing an option keeps focus in the input (mousedown is cancelled)", () => {
        const { input, options } = setup();
        fireEvent.change(input, { target: { value: "a" } });
        expect(fireEvent.mouseDown(options()[0])).toBe(false);
    });

    test("clicking an option chooses it; blur closes the list", () => {
        const onSelect = vi.fn();
        const { input, options } = setup({ onSelect });
        fireEvent.change(input, { target: { value: "a" } });
        fireEvent.click(options()[2]);
        expect(onSelect).toHaveBeenCalledWith("avocado");
        fireEvent.change(input, { target: { value: "av" } });
        fireEvent.blur(input);
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    test("a controlled value shows the prop and reports the choice", () => {
        const onSelect = vi.fn();
        const { input } = setup({ value: "x", onSelect });
        fireEvent.keyDown(input, { key: "ArrowDown" });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(onSelect).toHaveBeenCalledWith("apple");
        expect(input.value).toBe("x");
    });

    test("a form reset restores the starting text when uncontrolled, and is skipped when cancelled", async () => {
        const onInput = vi.fn();
        const { container } = render(
            <form>
                <Autosuggest
                    label="Fruit"
                    suggestions={fruit}
                    defaultValue="init"
                    onInput={onInput}
                />
            </form>,
        );
        const form = container.querySelector("form")!;
        const input = container.querySelector("input")!;
        fireEvent.change(input, { target: { value: "chg" } });
        form.reset();
        await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
        expect(input.value).toBe("init");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        fireEvent.change(input, { target: { value: "chg" } });
        form.addEventListener("reset", (e) => e.preventDefault());
        form.reset();
        await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
        expect(input.value).toBe("chg");
    });
});
