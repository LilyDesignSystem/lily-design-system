import { afterEach, describe, expect, test } from "vitest";

import { MenuItem } from "./menu-item.js";

if (!customElements.get("lily-menu-item")) {
    customElements.define("lily-menu-item", MenuItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MenuItem", () => {
    test("the host itself carries role=menuitem", () => {
        const host = render("<lily-menu-item>New File</lily-menu-item>");

        expect(host.getAttribute("role")).toBe("menuitem");
    });

    test("the host itself carries tabindex=-1", () => {
        const host = render("<lily-menu-item>New File</lily-menu-item>");

        expect(host.getAttribute("tabindex")).toBe("-1");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-menu-item class="extra">New File</lily-menu-item>');

        expect(host.className).toBe("menu-item extra");
    });

    test("children are left in place (self-is-the-wrapper)", () => {
        const host = render("<lily-menu-item>New File</lily-menu-item>");

        expect(host.textContent).toBe("New File");
    });

    test("a consumer-supplied aria-disabled attribute is preserved", () => {
        const host = render('<lily-menu-item aria-disabled="true">Paste</lily-menu-item>');

        expect(host.getAttribute("aria-disabled")).toBe("true");
    });

    test("a consumer-supplied aria-haspopup/aria-expanded pair is preserved", () => {
        const host = render('<lily-menu-item aria-haspopup="true" aria-expanded="false">Recent Files</lily-menu-item>');

        expect(host.getAttribute("aria-haspopup")).toBe("true");
        expect(host.getAttribute("aria-expanded")).toBe("false");
    });
});
