import { afterEach, describe, expect, test } from "vitest";

import { ToggleGroup } from "./toggle-group.js";

if (!customElements.get("lily-toggle-group")) {
    customElements.define("lily-toggle-group", ToggleGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToggleGroup", () => {
    test("the host itself carries the base class and role=group", () => {
        const host = render('<lily-toggle-group label="Text formatting"></lily-toggle-group>');

        expect(host.className).toBe("toggle-group");
        expect(host.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-toggle-group label="Text formatting"></lily-toggle-group>');

        expect(host.getAttribute("aria-label")).toBe("Text formatting");
    });

    test("leaves children in place, unmoved", () => {
        const host = render(
            '<lily-toggle-group label="Text formatting"><button aria-pressed="false">Bold</button></lily-toggle-group>',
        );

        expect(host.querySelector(":scope > button")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-toggle-group label="Text formatting" class="extra"></lily-toggle-group>');

        expect(host.className).toBe("toggle-group extra");
    });

    test("passes through rest attributes such as data-testid", () => {
        const host = render('<lily-toggle-group label="Text formatting" data-testid="fmt"></lily-toggle-group>');

        expect(host.getAttribute("data-testid")).toBe("fmt");
    });
});
