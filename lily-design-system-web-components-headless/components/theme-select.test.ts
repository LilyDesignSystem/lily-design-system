import { afterEach, describe, expect, test } from "vitest";

import { ThemeSelect } from "./theme-select.js";
import { ThemeSelectOption } from "./theme-select-option.js";

if (!customElements.get("lily-theme-select")) {
    customElements.define("lily-theme-select", ThemeSelect);
}
if (!customElements.get("lily-theme-select-option")) {
    customElements.define("lily-theme-select-option", ThemeSelectOption);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const PLAIN_OPTIONS = '<option value="light">Light</option><option value="dark">Dark</option>';

const NESTED_OPTIONS =
    '<lily-theme-select-option value="light">Light</lily-theme-select-option>' +
    '<lily-theme-select-option value="dark">Dark</lily-theme-select-option>';

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ThemeSelect", () => {
    test("renders a native select", () => {
        const host = render(`<lily-theme-select label="Theme">${PLAIN_OPTIONS}</lily-theme-select>`);

        expect(host.querySelector("select")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-theme-select label="Theme">${PLAIN_OPTIONS}</lily-theme-select>`);

        expect(host.querySelector("select")!.getAttribute("aria-label")).toBe("Theme");
    });

    test("moves plain option children into the select and seeds value immediately", () => {
        const host = render(`<lily-theme-select label="Theme" value="dark">${PLAIN_OPTIONS}</lily-theme-select>`);

        expect(host.querySelectorAll("select > option").length).toBe(2);
        expect((host.querySelector("select") as HTMLSelectElement).value).toBe("dark");
    });

    test("with nested ThemeSelectOption children, the initial value applies once they finish upgrading", async () => {
        const host = render(`<lily-theme-select label="Theme" value="dark">${NESTED_OPTIONS}</lily-theme-select>`);

        // Flush the queued microtask that re-applies `value` once every
        // nested ThemeSelectOption has replaced itself with a real <option>.
        await Promise.resolve();

        const select = host.querySelector("select") as HTMLSelectElement;
        expect(select.querySelectorAll("option").length).toBe(2);
        expect(select.value).toBe("dark");
    });

    test("exposes a live value property proxying the inner select", () => {
        const host = render(`<lily-theme-select label="Theme">${PLAIN_OPTIONS}</lily-theme-select>`) as unknown as ThemeSelect;
        const select = host.querySelector("select") as HTMLSelectElement;

        host.value = "dark";

        expect(select.value).toBe("dark");
        expect(host.value).toBe("dark");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(`<lily-theme-select label="Theme" class="extra">${PLAIN_OPTIONS}</lily-theme-select>`);

        expect(host.querySelector("select")!.className).toBe("theme-select extra");
    });

    test("passes through rest attributes such as disabled even though it is not a documented prop", () => {
        const host = render(`<lily-theme-select label="Theme" disabled>${PLAIN_OPTIONS}</lily-theme-select>`);

        expect((host.querySelector("select") as HTMLSelectElement).disabled).toBe(true);
    });
});
