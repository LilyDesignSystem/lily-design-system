import { afterEach, describe, expect, test, vi } from "vitest";

import { Autosuggest } from "./autosuggest.js";

if (!customElements.get("lily-autosuggest")) {
    customElements.define("lily-autosuggest", Autosuggest);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const OPTIONS = '<li role="option" data-value="uk">United Kingdom</li><li role="option" data-value="us">United States</li>';

describe("Autosuggest", () => {
    test("the custom element itself is the combobox wrapper (self-is-the-wrapper)", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`);

        expect(host.className).toBe("autosuggest");
        expect(host.getAttribute("role")).toBe("combobox");
        expect(host.getAttribute("aria-haspopup")).toBe("listbox");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`);

        expect(host.getAttribute("aria-label")).toBe("Country");
    });

    test("renders an input and a hidden listbox from the moved children", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`);

        const input = host.querySelector("input") as HTMLInputElement;
        const list = host.querySelector("ul.autosuggest-list") as HTMLUListElement;
        expect(input).toBeTruthy();
        expect(list.hidden).toBe(true);
        expect(host.getAttribute("aria-expanded")).toBe("false");

        const options = list.querySelectorAll("[role='option']");
        expect(options.length).toBe(2);
        expect(input.getAttribute("aria-controls")).toBe(list.id);
    });

    test("ArrowDown opens the listbox and highlights the first option", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`);
        const input = host.querySelector("input") as HTMLInputElement;

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

        expect(host.getAttribute("aria-expanded")).toBe("true");
        const first = host.querySelectorAll("[role='option']")[0];
        expect(first.getAttribute("aria-selected")).toBe("true");
        expect(input.getAttribute("aria-activedescendant")).toBe(first.id);
    });

    test("Enter selects the highlighted option, sets value, and closes", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`);
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-select", handler);

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(input.value).toBe("uk");
        expect(host.getAttribute("aria-expanded")).toBe("false");
        expect(handler).toHaveBeenCalled();
        expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "uk" });
    });

    test("Escape closes the listbox without changing the value", () => {
        const host = render(`<lily-autosuggest label="Country" value="Can">${OPTIONS}</lily-autosuggest>`);
        const input = host.querySelector("input") as HTMLInputElement;

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.getAttribute("aria-expanded")).toBe("false");
        expect(input.value).toBe("Can");
    });

    test("typing fires lily-input with the current value", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`);
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-input", handler);

        input.value = "Un";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "Un" });
    });

    test("value property proxies the inner input", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`) as Autosuggest;

        host.value = "France";

        expect(host.querySelector("input")!.value).toBe("France");
        expect(host.value).toBe("France");
    });
});
