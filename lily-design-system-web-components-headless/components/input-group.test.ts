import { afterEach, describe, expect, test } from "vitest";

import { InputGroup } from "./input-group.js";

if (!customElements.get("lily-input-group")) {
    customElements.define("lily-input-group", InputGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("InputGroup", () => {
    test("renders with role=group and the base class", () => {
        const host = render('<lily-input-group label="Amount"><input type="number"></lily-input-group>');

        expect(host.getAttribute("role")).toBe("group");
        expect(host.className).toBe("input-group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-input-group label="Amount"><input type="number"></lily-input-group>');

        expect(host.getAttribute("aria-label")).toBe("Amount");
    });

    test("wraps prefix-slotted content in a prefix span", () => {
        const host = render(
            '<lily-input-group label="Amount"><span slot="prefix">$</span><input type="number"></lily-input-group>',
        );

        const prefix = host.querySelector(".input-group-prefix");
        expect(prefix).toBeTruthy();
        expect(prefix!.textContent).toBe("$");
    });

    test("wraps suffix-slotted content in a suffix span", () => {
        const host = render(
            '<lily-input-group label="Amount"><input type="number"><span slot="suffix">USD</span></lily-input-group>',
        );

        const suffix = host.querySelector(".input-group-suffix");
        expect(suffix).toBeTruthy();
        expect(suffix!.textContent).toBe("USD");
    });

    test("renders prefix, input, and suffix in order", () => {
        const host = render(
            '<lily-input-group label="Amount"><span slot="prefix">$</span><input type="number"><span slot="suffix">USD</span></lily-input-group>',
        );

        const children = Array.from(host.children).map((el) => el.tagName);
        expect(children).toEqual(["SPAN", "INPUT", "SPAN"]);
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-input-group label="Amount" class="my-extra"><input></lily-input-group>');

        expect(host.className).toBe("input-group my-extra");
    });
});
