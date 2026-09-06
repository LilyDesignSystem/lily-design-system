import { afterEach, describe, expect, test } from "vitest";

import { MenuGroup } from "./menu-group.js";

if (!customElements.get("lily-menu-group")) {
    customElements.define("lily-menu-group", MenuGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MenuGroup", () => {
    test("renders with role=group and the base class", () => {
        const host = render('<lily-menu-group label="File"></lily-menu-group>');

        expect(host.getAttribute("role")).toBe("group");
        expect(host.className).toBe("menu-group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-menu-group label="File"></lily-menu-group>');

        expect(host.getAttribute("aria-label")).toBe("File");
    });

    test("renders a visible aria-hidden heading matching the label", () => {
        const host = render('<lily-menu-group label="File"></lily-menu-group>');

        const heading = host.querySelector(".menu-group-heading");
        expect(heading).toBeTruthy();
        expect(heading!.getAttribute("aria-hidden")).toBe("true");
        expect(heading!.textContent).toBe("File");
    });

    test("children are rendered after the heading", () => {
        const host = render('<lily-menu-group label="File"><div role="menuitem">Open</div></lily-menu-group>');

        const children = Array.from(host.children);
        expect(children[0]!.className).toBe("menu-group-heading");
        expect(children[1]!.textContent).toBe("Open");
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-menu-group label="File" class="my-extra"></lily-menu-group>');

        expect(host.className).toBe("menu-group my-extra");
    });
});
