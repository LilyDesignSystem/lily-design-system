import { afterEach, describe, expect, test } from "vitest";

import { Listbox } from "./listbox.js";

if (!customElements.get("lily-listbox")) {
    customElements.define("lily-listbox", Listbox);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

function options(host: HTMLElement): HTMLElement[] {
    return Array.from(host.querySelectorAll<HTMLElement>("[role='option']"));
}

function keydown(host: HTMLElement, key: string): void {
    host.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

const OPTIONS_HTML = `
  <div role="option" tabindex="-1">High</div>
  <div role="option" tabindex="-1">Medium</div>
  <div role="option" tabindex="-1">Low</div>
`;

describe("Listbox", () => {
    test("renders as itself with the base class and role=listbox", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);

        expect(host.tagName.toLowerCase()).toBe("lily-listbox");
        expect(host.className).toBe("listbox");
        expect(host.getAttribute("role")).toBe("listbox");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);

        expect(host.getAttribute("aria-label")).toBe("Select priority");
    });

    test("preserves option children in place", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);

        expect(options(host).length).toBe(3);
    });

    test("ArrowDown moves focus to the next option, wrapping from last to first", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);
        const opts = options(host);
        opts[2].focus();

        keydown(host, "ArrowDown");
        expect(document.activeElement).toBe(opts[0]);
    });

    test("ArrowUp moves focus to the previous option, wrapping from first to last", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);
        const opts = options(host);
        opts[0].focus();

        keydown(host, "ArrowUp");
        expect(document.activeElement).toBe(opts[2]);
    });

    test("Home moves focus to the first option and End to the last", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);
        const opts = options(host);
        opts[1].focus();

        keydown(host, "Home");
        expect(document.activeElement).toBe(opts[0]);

        keydown(host, "End");
        expect(document.activeElement).toBe(opts[2]);
    });

    test("ignores keys it does not handle", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);
        const opts = options(host);
        opts[0].focus();

        keydown(host, "Escape");
        expect(document.activeElement).toBe(opts[0]);
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render(`<lily-listbox label="Select priority" class="settings-list">${OPTIONS_HTML}</lily-listbox>`);

        expect(host.className).toBe("listbox settings-list");
    });
});
