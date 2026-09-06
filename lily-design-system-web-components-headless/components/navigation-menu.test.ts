import { afterEach, describe, expect, test } from "vitest";

import { NavigationMenu } from "./navigation-menu.js";

if (!customElements.get("lily-navigation-menu")) {
    customElements.define("lily-navigation-menu", NavigationMenu);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NavigationMenu", () => {
    test("renders a native nav", () => {
        const host = render('<lily-navigation-menu label="Main navigation"><a href="/">Home</a></lily-navigation-menu>');

        expect(host.querySelector("nav.navigation-menu")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-navigation-menu label="Main navigation"></lily-navigation-menu>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Main navigation");
    });

    test("moves children into the nav", () => {
        const host = render('<lily-navigation-menu label="Main navigation"><a href="/">Home</a></lily-navigation-menu>');

        expect(host.querySelector("nav > a")!.textContent).toBe("Home");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-navigation-menu label="Main navigation" class="extra"></lily-navigation-menu>');

        expect(host.querySelector("nav")!.className).toBe("navigation-menu extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-navigation-menu label="Main navigation" data-testid="nav"></lily-navigation-menu>');

        expect(host.querySelector("nav")!.getAttribute("data-testid")).toBe("nav");
    });
});
