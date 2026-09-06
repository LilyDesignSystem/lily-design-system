import { afterEach, describe, expect, test } from "vitest";

import { ContextMenuItem } from "./context-menu-item.js";

if (!customElements.get("lily-context-menu-item")) {
    customElements.define("lily-context-menu-item", ContextMenuItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContextMenuItem", () => {
    test("renders with role=menuitem and the base class", () => {
        const host = render("<lily-context-menu-item>Cut</lily-context-menu-item>");

        expect(host.getAttribute("role")).toBe("menuitem");
        expect(host.className).toBe("context-menu-item");
    });

    test("carries tabindex=-1 for roving focus", () => {
        const host = render("<lily-context-menu-item>Cut</lily-context-menu-item>");

        expect(host.getAttribute("tabindex")).toBe("-1");
    });

    test("preserves its content", () => {
        const host = render("<lily-context-menu-item>Cut</lily-context-menu-item>");

        expect(host.textContent).toBe("Cut");
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-context-menu-item class="my-extra">Cut</lily-context-menu-item>');

        expect(host.className).toBe("context-menu-item my-extra");
    });

    test("consumer can add aria-disabled", () => {
        const host = render('<lily-context-menu-item aria-disabled="true">Delete</lily-context-menu-item>');

        expect(host.getAttribute("aria-disabled")).toBe("true");
    });
});
