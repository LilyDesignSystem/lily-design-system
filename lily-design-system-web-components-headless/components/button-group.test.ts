import { afterEach, describe, expect, test } from "vitest";

import { ButtonGroup } from "./button-group.js";

if (!customElements.get("lily-button-group")) {
    customElements.define("lily-button-group", ButtonGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ButtonGroup", () => {
    test("renders itself with the base class and role=group", () => {
        const host = render('<lily-button-group label="Form actions"></lily-button-group>');

        expect(host.classList.contains("button-group")).toBe(true);
        expect(host.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-button-group label="Form actions"></lily-button-group>');

        expect(host.getAttribute("aria-label")).toBe("Form actions");
    });

    test("renders child buttons in place", () => {
        const host = render(
            '<lily-button-group label="Form actions"><button type="button">Save</button><button type="button">Cancel</button></lily-button-group>',
        );

        expect(host.querySelectorAll("button").length).toBe(2);
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render('<lily-button-group label="Form actions" class="my-extra"></lily-button-group>');

        expect(host.className).toBe("button-group my-extra");
    });
});
