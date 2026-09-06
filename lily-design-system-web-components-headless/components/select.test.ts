import { afterEach, describe, expect, test } from "vitest";

import { Select } from "./select.js";

if (!customElements.get("lily-select")) {
    customElements.define("lily-select", Select);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const OPTIONS =
    '<option value="red">Red</option><option value="green">Green</option><option value="blue">Blue</option>';

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Select", () => {
    test("renders a native select", () => {
        const host = render(`<lily-select label="Colour">${OPTIONS}</lily-select>`);

        expect(host.querySelector("select")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-select label="Colour">${OPTIONS}</lily-select>`);

        expect(host.querySelector("select")!.getAttribute("aria-label")).toBe("Colour");
    });

    test("moves the option children into the select", () => {
        const host = render(`<lily-select label="Colour">${OPTIONS}</lily-select>`);

        expect(host.querySelectorAll("select > option").length).toBe(3);
    });

    test("seeds the selected value from the value attribute, after options are in place", () => {
        const host = render(`<lily-select label="Colour" value="green">${OPTIONS}</lily-select>`);

        expect((host.querySelector("select") as HTMLSelectElement).value).toBe("green");
    });

    test("exposes a live value property proxying the inner select", () => {
        const host = render(`<lily-select label="Colour">${OPTIONS}</lily-select>`) as unknown as Select;
        const select = host.querySelector("select") as HTMLSelectElement;

        host.value = "blue";

        expect(select.value).toBe("blue");
        expect(host.value).toBe("blue");
    });

    test("required and disabled propagate to the inner select", () => {
        const host = render(`<lily-select label="Colour" required disabled>${OPTIONS}</lily-select>`);

        const select = host.querySelector("select") as HTMLSelectElement;
        expect(select.required).toBe(true);
        expect(select.disabled).toBe(true);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(`<lily-select label="Colour" class="extra">${OPTIONS}</lily-select>`);

        expect(host.querySelector("select")!.className).toBe("select extra");
    });
});
