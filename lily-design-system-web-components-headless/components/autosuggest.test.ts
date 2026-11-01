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

const OPTIONS =
    '<li role="option" data-value="uk">United Kingdom</li><li role="option" data-value="us">United States</li>';

describe("Autosuggest", () => {
    const input = (host: HTMLElement) => host.querySelector("input") as HTMLInputElement;
    const list = (host: HTMLElement) => host.querySelector("[role='listbox']") as HTMLElement;
    const options = (host: HTMLElement) =>
        Array.from(host.querySelectorAll<HTMLElement>("[role='option']"));
    const active = (host: HTMLElement) =>
        options(host).findIndex((o) => o.id === input(host).getAttribute("aria-activedescendant"));
    function press(host: HTMLElement, key: string) {
        const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
        input(host).dispatchEvent(event);
        return event;
    }
    function type(host: HTMLElement, text: string) {
        input(host).value = text;
        input(host).dispatchEvent(new Event("input", { bubbles: true }));
    }
    const THREE =
        '<li role="option" data-value="fr">France</li><li role="option" data-value="de">Germany</li><li role="option" data-value="it">Italy</li>';

    test("the custom element itself is the wrapper; the input is the labelled combobox", () => {
        const host = render(
            `<lily-autosuggest label="Country" class="extra">${OPTIONS}</lily-autosuggest>`,
        );

        expect(host.className).toBe("autosuggest extra");
        expect(host.hasAttribute("role")).toBe(false);
        expect(input(host).getAttribute("role")).toBe("combobox");
        expect(input(host).getAttribute("aria-label")).toBe("Country");
        expect(input(host).getAttribute("aria-autocomplete")).toBe("list");
        expect(input(host).getAttribute("aria-expanded")).toBe("false");
        expect(input(host).getAttribute("aria-controls")).toBe(list(host).id);
        expect(input(host).hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("renders a hidden listbox from the moved children", () => {
        const host = render(`<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`);

        expect(list(host).hidden).toBe(true);
        expect(list(host).getAttribute("aria-label")).toBe("Country");
        expect(options(host).map((o) => o.getAttribute("aria-selected"))).toEqual([
            "false",
            "false",
        ]);
    });

    test("typing fires lily-input and opens the list; replaced options keep it in step", async () => {
        const host = render(`<lily-autosuggest label="Country"></lily-autosuggest>`);
        const handler = vi.fn();
        host.addEventListener("lily-input", handler);

        type(host, "Un");
        expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "Un" });
        expect(input(host).getAttribute("aria-expanded")).toBe("false");
        list(host).innerHTML = OPTIONS;
        await Promise.resolve();
        expect(input(host).getAttribute("aria-expanded")).toBe("true");
        expect(list(host).hidden).toBe(false);
        list(host).innerHTML = "";
        await Promise.resolve();
        expect(input(host).getAttribute("aria-expanded")).toBe("false");
    });

    test("ArrowDown and ArrowUp move the highlight, wrapping", () => {
        const host = render(`<lily-autosuggest label="Country">${THREE}</lily-autosuggest>`);

        expect(press(host, "ArrowDown").defaultPrevented).toBe(true);
        expect(input(host).getAttribute("aria-expanded")).toBe("true");
        expect(active(host)).toBe(0);
        expect(options(host)[0].getAttribute("aria-selected")).toBe("true");
        press(host, "ArrowDown");
        expect(active(host)).toBe(1);
        press(host, "ArrowUp");
        press(host, "ArrowUp");
        expect(active(host)).toBe(2);
        press(host, "ArrowDown");
        expect(active(host)).toBe(0);
    });

    test("Home and End jump to the first and last option", () => {
        const host = render(`<lily-autosuggest label="Country">${THREE}</lily-autosuggest>`);

        press(host, "ArrowDown");
        press(host, "End");
        expect(active(host)).toBe(2);
        press(host, "Home");
        expect(active(host)).toBe(0);
    });

    test("Enter chooses the highlighted option, sets value, closes and fires lily-select", () => {
        const host = render(
            `<lily-autosuggest label="Country">${THREE}</lily-autosuggest>`,
        ) as Autosuggest;
        const handler = vi.fn();
        host.addEventListener("lily-select", handler);

        press(host, "ArrowDown");
        press(host, "ArrowDown");
        press(host, "Enter");

        expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "de" });
        expect(host.value).toBe("de");
        expect(input(host).getAttribute("aria-expanded")).toBe("false");
        expect(input(host).hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("Escape closes the listbox without changing the value", () => {
        const host = render(
            `<lily-autosuggest label="Country" value="Fr">${THREE}</lily-autosuggest>`,
        );
        const handler = vi.fn();
        host.addEventListener("lily-select", handler);

        press(host, "ArrowDown");
        press(host, "Escape");

        expect(input(host).getAttribute("aria-expanded")).toBe("false");
        expect(handler).not.toHaveBeenCalled();
        expect(input(host).value).toBe("Fr");
    });

    test("pressing an option keeps focus; clicking chooses it; blur closes", () => {
        const host = render(`<lily-autosuggest label="Country">${THREE}</lily-autosuggest>`);

        type(host, "a");
        const down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
        options(host)[2].dispatchEvent(down);
        expect(down.defaultPrevented).toBe(true);
        options(host)[2].click();
        expect(input(host).value).toBe("it");
        type(host, "i");
        expect(input(host).getAttribute("aria-expanded")).toBe("true");
        input(host).dispatchEvent(new Event("blur"));
        expect(input(host).getAttribute("aria-expanded")).toBe("false");
    });

    test("value property proxies the inner input", () => {
        const host = render(
            `<lily-autosuggest label="Country">${OPTIONS}</lily-autosuggest>`,
        ) as Autosuggest;

        host.value = "France";

        expect(host.querySelector("input")!.value).toBe("France");
        expect(host.value).toBe("France");
    });
});
