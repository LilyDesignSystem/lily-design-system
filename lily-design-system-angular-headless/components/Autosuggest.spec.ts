import { describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Autosuggest } from "./Autosuggest";

const fruit = [
    { value: "apple", label: "Apple" },
    { value: "apricot", label: "Apricot" },
    { value: "avocado", label: "Avocado" },
];

function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Autosuggest);
    for (const [k, v] of Object.entries({ label: "Fruit", suggestions: fruit, ...inputs }))
        fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement.querySelector("div.autosuggest");
    const input = root.querySelector("input") as HTMLInputElement;
    const list = root.querySelector('[role="listbox"]') as HTMLElement;
    const options = () => Array.from(root.querySelectorAll('[role="option"]')) as HTMLElement[];
    const press = (key: string) => {
        const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
        input.dispatchEvent(event);
        fixture.detectChanges();
        return event;
    };
    const type = (text: string) => {
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        fixture.detectChanges();
    };
    const selected = vi.fn();
    const query = vi.fn();
    fixture.componentInstance.selected.subscribe(selected);
    fixture.componentInstance.query.subscribe(query);
    return { fixture, root, input, list, options, press, type, selected, query };
}

describe("Autosuggest", () => {
    test("renders the div root with the base class", () => {
        expect(create().root).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        expect(create({ className: "extra" }).root.classList.contains("extra")).toBe(true);
    });

    test("is an input combobox controlling a hidden listbox", () => {
        const { input, list } = create();
        expect(input.getAttribute("role")).toBe("combobox");
        expect(input.getAttribute("aria-label")).toBe("Fruit");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.getAttribute("aria-controls")).toBe(list.id);
        expect(list.hidden).toBe(true);
    });

    test("typing emits the query and opens the list; no suggestions keeps it closed", () => {
        const { input, list, type, query } = create();
        type("ap");
        expect(query).toHaveBeenCalledWith("ap");
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(list.hidden).toBe(false);
        const empty = create({ suggestions: [] });
        empty.type("zz");
        expect(empty.input.getAttribute("aria-expanded")).toBe("false");
    });

    test("ArrowDown and ArrowUp move the highlight, wrapping", () => {
        const { input, options, press } = create();
        expect(press("ArrowDown").defaultPrevented).toBe(true);
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
        expect(options()[0].getAttribute("aria-selected")).toBe("true");
        press("ArrowDown");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[1].id);
        press("ArrowUp");
        press("ArrowUp");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        press("ArrowDown");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Home and End jump to the first and last option", () => {
        const { input, options, press } = create();
        press("ArrowDown");
        press("End");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        press("Home");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Enter chooses the highlighted option, fills the input and closes", () => {
        const { fixture, input, press, selected } = create();
        press("ArrowDown");
        press("ArrowDown");
        press("Enter");
        expect(selected).toHaveBeenCalledWith("apricot");
        expect(fixture.componentInstance.value()).toBe("apricot");
        expect(input.value).toBe("apricot");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("Escape closes without choosing", () => {
        const { input, press, selected } = create({ value: "ap" });
        press("ArrowDown");
        press("Escape");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(selected).not.toHaveBeenCalled();
        expect(input.value).toBe("ap");
    });

    test("pressing an option keeps focus in the input (mousedown is cancelled)", () => {
        const { options, type } = create();
        type("a");
        const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
        options()[0].dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });

    test("clicking an option chooses it; blur closes the list", () => {
        const { fixture, input, options, type, selected } = create();
        type("a");
        options()[2].click();
        fixture.detectChanges();
        expect(selected).toHaveBeenCalledWith("avocado");
        type("av");
        input.dispatchEvent(new Event("blur"));
        fixture.detectChanges();
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });
});
