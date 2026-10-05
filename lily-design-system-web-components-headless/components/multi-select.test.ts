import { afterEach, describe, expect, test } from "vitest";

import { MultiSelect } from "./multi-select.js";

if (!customElements.get("lily-multi-select")) {
    customElements.define("lily-multi-select", MultiSelect);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const OPTIONS = '<option value="a">A</option><option value="b">B</option><option value="c">C</option>';

describe("MultiSelect", () => {
    test("renders a native <select multiple> with the base class", () => {
        const host = render(`<lily-multi-select label="Tags">${OPTIONS}</lily-multi-select>`);
        const select = host.querySelector("select")!;
        expect(select.multiple).toBe(true);
        expect(select.className).toBe("multi-select");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-multi-select label="Tags">${OPTIONS}</lily-multi-select>`);
        expect(host.querySelector("select")!.getAttribute("aria-label")).toBe("Tags");
    });

    test("moves the option children into the select", () => {
        const host = render(`<lily-multi-select label="Tags">${OPTIONS}</lily-multi-select>`);
        expect(host.querySelectorAll("select > option").length).toBe(3);
    });

    test("initial JSON array value selects the matching options", () => {
        const host = render(`<lily-multi-select label="Tags" value='["a","c"]'>${OPTIONS}</lily-multi-select>`) as unknown as MultiSelect;
        expect(host.value).toEqual(["a", "c"]);
    });

    test("comma-separated initial value is accepted", () => {
        const host = render(`<lily-multi-select label="Tags" value="b, c">${OPTIONS}</lily-multi-select>`) as unknown as MultiSelect;
        expect(host.value).toEqual(["b", "c"]);
    });

    test("several options can be selected and the value property reads them", () => {
        const host = render(`<lily-multi-select label="Tags">${OPTIONS}</lily-multi-select>`) as unknown as MultiSelect;
        const options = host.querySelectorAll("option");
        options[0].selected = true;
        options[1].selected = true;
        expect(host.value).toEqual(["a", "b"]);
        host.value = ["c"];
        expect(host.value).toEqual(["c"]);
    });

    test("size sets the visible rows", () => {
        const host = render(`<lily-multi-select label="Tags" size="4">${OPTIONS}</lily-multi-select>`);
        expect(host.querySelector("select")!.size).toBe(4);
    });

    test("supports required and disabled", () => {
        const select = render(`<lily-multi-select label="Tags" required disabled>${OPTIONS}</lily-multi-select>`).querySelector("select")!;
        expect(select.required).toBe(true);
        expect(select.disabled).toBe(true);
    });

    test("passes through attributes and the consumer class", () => {
        const select = render(`<lily-multi-select label="Tags" data-testid="x" class="extra">${OPTIONS}</lily-multi-select>`).querySelector("select")!;
        expect(select.getAttribute("data-testid")).toBe("x");
        expect(select.className).toBe("multi-select extra");
    });
});
