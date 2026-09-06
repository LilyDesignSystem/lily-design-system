import { afterEach, describe, expect, test } from "vitest";

import { HamburgerMenu } from "./hamburger-menu.js";

if (!customElements.get("lily-hamburger-menu")) {
    customElements.define("lily-hamburger-menu", HamburgerMenu);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HamburgerMenu", () => {
    test("renders a native button", () => {
        const host = render("<lily-hamburger-menu></lily-hamburger-menu>");

        expect(host.querySelector("button.hamburger-menu")).toBeTruthy();
    });

    test("defaults the accessible name to Menu", () => {
        const host = render("<lily-hamburger-menu></lily-hamburger-menu>");

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Menu");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-hamburger-menu label="Main menu"></lily-hamburger-menu>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Main menu");
    });

    test("defaults aria-expanded to false", () => {
        const host = render("<lily-hamburger-menu></lily-hamburger-menu>");

        expect(host.querySelector("button")!.getAttribute("aria-expanded")).toBe("false");
    });

    test("the open attribute reflects aria-expanded=true", () => {
        const host = render("<lily-hamburger-menu open></lily-hamburger-menu>");

        expect(host.querySelector("button")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("clicking toggles open and dispatches lily-change", () => {
        const host = render("<lily-hamburger-menu></lily-hamburger-menu>");
        const button = host.querySelector("button") as HTMLButtonElement;
        let detail: { open: boolean } | undefined;
        host.addEventListener("lily-change", (event) => {
            detail = (event as CustomEvent<{ open: boolean }>).detail;
        });

        button.click();

        expect(host.hasAttribute("open")).toBe(true);
        expect(detail).toEqual({ open: true });
        expect(button.getAttribute("aria-expanded")).toBe("true");
    });

    test("clicking again toggles back off", () => {
        const host = render("<lily-hamburger-menu open></lily-hamburger-menu>");
        const button = host.querySelector("button") as HTMLButtonElement;

        button.click();

        expect(host.hasAttribute("open")).toBe(false);
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("toggling open syncs the hidden attribute of the referenced aria-controls target", () => {
        document.body.innerHTML =
            '<lily-hamburger-menu aria-controls="site-nav"></lily-hamburger-menu>' + '<nav id="site-nav" hidden></nav>';
        if (!customElements.get("lily-hamburger-menu")) customElements.define("lily-hamburger-menu", HamburgerMenu);
        const host = document.querySelector("lily-hamburger-menu")!;
        const button = host.querySelector("button") as HTMLButtonElement;
        const nav = document.getElementById("site-nav") as HTMLElement;

        button.click();
        expect(nav.hidden).toBe(false);

        button.click();
        expect(nav.hidden).toBe(true);
    });

    test("external toggleAttribute API updates aria-expanded via attributeChangedCallback", () => {
        const host = render("<lily-hamburger-menu></lily-hamburger-menu>");

        host.toggleAttribute("open", true);

        expect(host.querySelector("button")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("moves children into the button", () => {
        const host = render("<lily-hamburger-menu><span>Menu</span></lily-hamburger-menu>");

        expect(host.querySelector("button > span")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-hamburger-menu class="extra"></lily-hamburger-menu>');

        expect(host.querySelector("button")!.className).toBe("hamburger-menu extra");
    });
});
