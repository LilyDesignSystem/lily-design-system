import { afterEach, describe, expect, test } from "vitest";

import { AddressInput } from "./address-input.js";

if (!customElements.get("lily-address-input")) {
    customElements.define("lily-address-input", AddressInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const FIELDS =
    '<label for="street">Street</label><input id="street" autocomplete="address-line1">' +
    '<label for="postcode">Postal code</label><input id="postcode" autocomplete="postal-code">';

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

function root(host: HTMLElement): HTMLDivElement {
    return host.querySelector(":scope > div.address-input") as HTMLDivElement;
}

describe("AddressInput", () => {
    test("renders a <div role=group> with the base class", () => {
        const host = render('<lily-address-input label="Delivery address"></lily-address-input>');

        expect(root(host)).toBeTruthy();
        expect(root(host).getAttribute("role")).toBe("group");
    });

    test("uses label as the group's accessible name", () => {
        const host = render('<lily-address-input label="Delivery address"></lily-address-input>');

        expect(root(host).getAttribute("aria-label")).toBe("Delivery address");
        expect(root(host).hasAttribute("label")).toBe(false);
    });

    test("moves the consumer's fields into the group unchanged", () => {
        const host = render(
            `<lily-address-input label="Delivery address">${FIELDS}</lily-address-input>`,
        );

        const inputs = Array.from(root(host).querySelectorAll("input"));
        expect(inputs.map((i) => i.getAttribute("autocomplete"))).toEqual([
            "address-line1",
            "postal-code",
        ]);
    });

    test("passes other attributes through and keeps the consumer's class", () => {
        const host = render(
            '<lily-address-input label="A" class="extra" data-x="1"></lily-address-input>',
        );

        expect(root(host).className).toBe("address-input extra");
        expect(root(host).getAttribute("data-x")).toBe("1");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render(`<lily-address-input label="A">${FIELDS}</lily-address-input>`);

        (host as unknown as AddressInput).connectedCallback();

        expect(host.querySelectorAll("div.address-input").length).toBe(1);
        expect(root(host).querySelectorAll("input").length).toBe(2);
    });
});
