import { afterEach, describe, expect, test } from "vitest";

import { MenuBarButton } from "./menu-bar-button.js";

if (!customElements.get("lily-menu-bar-button")) {
    customElements.define("lily-menu-bar-button", MenuBarButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MenuBarButton", () => {
    test("renders a native button", () => {
        const host = render("<lily-menu-bar-button>File</lily-menu-bar-button>");

        expect(host.querySelector("button.menu-bar-button")).toBeTruthy();
    });

    test("has role=menuitem", () => {
        const host = render("<lily-menu-bar-button>File</lily-menu-bar-button>");

        expect(host.querySelector("button")!.getAttribute("role")).toBe("menuitem");
    });

    test("has tabindex=-1 so focus is roved by the parent MenuBar", () => {
        const host = render("<lily-menu-bar-button>File</lily-menu-bar-button>");

        expect(host.querySelector("button")!.tabIndex).toBe(-1);
    });

    test("moves children into the button", () => {
        const host = render("<lily-menu-bar-button>File</lily-menu-bar-button>");

        expect(host.querySelector("button")!.textContent).toBe("File");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-menu-bar-button class="extra">File</lily-menu-bar-button>');

        expect(host.querySelector("button")!.className).toBe("menu-bar-button extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-menu-bar-button data-testid="file">File</lily-menu-bar-button>');

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("file");
    });
});
