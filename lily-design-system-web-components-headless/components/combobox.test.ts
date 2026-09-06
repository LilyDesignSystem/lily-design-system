import { afterEach, describe, expect, test, vi } from "vitest";

import { Combobox } from "./combobox.js";

if (!customElements.get("lily-combobox")) {
    customElements.define("lily-combobox", Combobox);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Combobox", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper) and builds an input+listbox", () => {
        const host = render(
            '<lily-combobox label="Fruit"><div role="option">Apple</div><div role="option">Banana</div></lily-combobox>',
        );

        expect(host.className).toBe("combobox");
        const input = host.querySelector("input") as HTMLInputElement;
        const listbox = host.querySelector('[role="listbox"]') as HTMLElement;
        expect(input.getAttribute("role")).toBe("combobox");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    });

    test("uses label as the accessible name on both input and listbox", () => {
        const host = render('<lily-combobox label="Fruit"></lily-combobox>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Fruit");
        expect(host.querySelector('[role="listbox"]')!.getAttribute("aria-label")).toBe("Fruit");
    });

    test("listbox is hidden by default, aria-expanded false; open attribute reveals it", () => {
        const closed = render('<lily-combobox label="Fruit"></lily-combobox>');
        expect(closed.querySelector('[role="listbox"]')!.hidden).toBe(true);
        expect(closed.querySelector("input")!.getAttribute("aria-expanded")).toBe("false");

        const open = render('<lily-combobox label="Fruit" open></lily-combobox>');
        expect(open.querySelector('[role="listbox"]')!.hidden).toBe(false);
        expect(open.querySelector("input")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("ArrowDown opens the listbox when closed", () => {
        const host = render('<lily-combobox label="Fruit"></lily-combobox>');
        const input = host.querySelector("input") as HTMLInputElement;

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(true);
    });

    test("ArrowDown moves aria-activedescendant among the options", () => {
        const host = render(
            '<lily-combobox label="Fruit" open><div role="option">Apple</div><div role="option">Apricot</div></lily-combobox>',
        );
        const input = host.querySelector("input") as HTMLInputElement;
        const opts = host.querySelectorAll('[role="option"]');

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(input.getAttribute("aria-activedescendant")).toBe(opts[0].id);

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(input.getAttribute("aria-activedescendant")).toBe(opts[1].id);
    });

    test("typing filters via typeahead: matching option becomes active", () => {
        const host = render(
            '<lily-combobox label="Fruit"><div role="option">Apple</div><div role="option">Banana</div></lily-combobox>',
        );
        const input = host.querySelector("input") as HTMLInputElement;

        input.value = "ban";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        const banana = host.querySelectorAll('[role="option"]')[1];
        expect(input.getAttribute("aria-activedescendant")).toBe(banana.id);
        expect(host.hasAttribute("open")).toBe(true);
    });

    test("Enter selects the active option, sets value, closes, and dispatches lily-change", () => {
        const host = render(
            '<lily-combobox label="Fruit" open><div role="option">Apple</div><div role="option">Banana</div></lily-combobox>',
        ) as unknown as Combobox;
        const input = host.querySelector("input") as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(host.value).toBe("Apple");
        expect(host.hasAttribute("open")).toBe(false);
        expect(handler).toHaveBeenCalledTimes(1);
        expect((handler.mock.calls[0][0] as CustomEvent<{ value: string }>).detail).toEqual({ value: "Apple" });
    });

    test("Escape closes the dropdown without changing the value", () => {
        const host = render(
            '<lily-combobox label="Fruit" open value="ap"><div role="option">Apple</div></lily-combobox>',
        ) as unknown as Combobox;
        const input = host.querySelector("input") as HTMLInputElement;

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(host.value).toBe("ap");
    });

    test("exposes live value/open properties", () => {
        const host = render('<lily-combobox label="Fruit"></lily-combobox>') as unknown as Combobox;

        host.value = "Cherry";
        host.open = true;

        expect(host.value).toBe("Cherry");
        expect(host.open).toBe(true);
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Cherry");
    });
});
