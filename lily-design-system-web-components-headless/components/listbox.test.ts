import { afterEach, describe, expect, test } from "vitest";

import { Listbox } from "./listbox.js";

// Option groups (tasks.md P40-T4): the APG grouped listbox, two labelled groups of options.
const GROUPED_HTML =
    '<div role="group" aria-labelledby="g-common"><div role="presentation" id="g-common">Common</div><div role="option" tabindex="-1" id="code-apple">Apple</div><div role="option" tabindex="-1" id="code-avocado">Avocado</div></div><div role="group" aria-labelledby="g-lab"><div role="presentation" id="g-lab">Lab</div><div role="option" tabindex="-1" id="code-banana">Banana</div><div role="option" tabindex="-1" id="code-cherry">Cherry</div></div>';

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

    test("prevents the default for the keys it handles, and only those", () => {
        const host = render(`<lily-listbox label="Select priority">${OPTIONS_HTML}</lily-listbox>`);
        options(host)[0].focus();
        const press = (key: string) => {
            const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
            host.dispatchEvent(event);
            return event.defaultPrevented;
        };

        expect(press("ArrowDown")).toBe(true);
        expect(press("End")).toBe(true);
        expect(press("Tab")).toBe(false);
        expect(press("a")).toBe(false);
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render(
            `<lily-listbox label="Select priority" class="settings-list">${OPTIONS_HTML}</lily-listbox>`,
        );

        expect(host.className).toBe("listbox settings-list");
    });

    test("option groups: the arrows cross from one group to the next, and headings are not options", () => {
        const host = render(`<lily-listbox label="Codes">${GROUPED_HTML}</lily-listbox>`);
        const options = Array.from(host.querySelectorAll<HTMLElement>("[role='option']"));
        expect(options.map((o) => o.textContent)).toEqual(["Apple", "Avocado", "Banana", "Cherry"]);
        options[1].focus();
        options[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(options[2]);
    });
});
