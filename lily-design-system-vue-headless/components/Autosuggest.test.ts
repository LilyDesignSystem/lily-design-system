import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/vue";

import Autosuggest from "./Autosuggest.vue";

const fruit = [
    { value: "apple", label: "Apple" },
    { value: "apricot", label: "Apricot" },
    { value: "avocado", label: "Avocado" },
];

function setup(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
    const result = render(Autosuggest, {
        props: { label: "Fruit", suggestions: fruit, ...props },
        attrs,
    });
    const input = screen.getByRole("combobox") as HTMLInputElement;
    const list = result.container.querySelector('[role="listbox"]') as HTMLElement;
    const options = () =>
        Array.from(result.container.querySelectorAll('[role="option"]')) as HTMLElement[];
    return { ...result, input, list, options };
}

describe("Autosuggest", () => {
    test("renders a div root with an input combobox and a hidden listbox", () => {
        const { container, input, list } = setup({}, { class: "extra" });
        const root = container.querySelector("div.autosuggest") as HTMLElement;
        expect(root.classList.contains("extra")).toBe(true);
        expect(input.getAttribute("aria-label")).toBe("Fruit");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.getAttribute("aria-controls")).toBe(list.id);
        expect(list.hidden).toBe(true);
    });

    test("typing emits the query and opens the list", async () => {
        const { input, list, emitted } = setup();
        await fireEvent.update(input, "ap");
        expect(emitted()["input"]).toEqual([["ap"]]);
        expect(emitted()["update:modelValue"]).toEqual([["ap"]]);
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(list.hidden).toBe(false);
    });

    test("the list stays closed while there are no suggestions", async () => {
        const { input } = setup({ suggestions: [] });
        await fireEvent.update(input, "zz");
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    test("ArrowDown and ArrowUp move the highlight, wrapping, via aria-activedescendant", async () => {
        const { input, options } = setup();
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
        expect(options()[0].getAttribute("aria-selected")).toBe("true");
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[1].id);
        await fireEvent.keyDown(input, { key: "ArrowUp" });
        await fireEvent.keyDown(input, { key: "ArrowUp" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Home and End jump to the first and last option", async () => {
        const { input, options } = setup();
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "End" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        await fireEvent.keyDown(input, { key: "Home" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Enter chooses the highlighted option, fills the input and closes", async () => {
        const { input, emitted } = setup();
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(emitted()["select"]).toEqual([["apricot"]]);
        expect(emitted()["update:modelValue"]).toEqual([["apricot"]]);
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("Escape closes without choosing", async () => {
        const { input, emitted } = setup({ modelValue: "ap" });
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(emitted()["select"]).toBeUndefined();
        expect(input.value).toBe("ap");
    });

    test("pressing an option keeps focus in the input (mousedown is cancelled)", async () => {
        const { input, options } = setup();
        await fireEvent.update(input, "a");
        const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
        options()[0].dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });

    test("clicking an option chooses it; blur closes the list", async () => {
        const { input, options, emitted } = setup();
        await fireEvent.update(input, "a");
        await fireEvent.click(options()[2]);
        expect(emitted()["select"]).toEqual([["avocado"]]);
        await fireEvent.update(input, "av");
        await fireEvent.blur(input);
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });
});
