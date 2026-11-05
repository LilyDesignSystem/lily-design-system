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
    test("renders a div holding a native button and the navigation", () => {
        const host = render("<lily-hamburger-menu></lily-hamburger-menu>");

        expect(
            host.querySelector("div.hamburger-menu > button.hamburger-menu-button"),
        ).toBeTruthy();
        expect(host.querySelector("div.hamburger-menu > nav.hamburger-menu-nav")).toBeTruthy();
    });

    test("each menu has its own navigation id", () => {
        document.body.innerHTML =
            "<lily-hamburger-menu></lily-hamburger-menu><lily-hamburger-menu></lily-hamburger-menu>";
        const [first, second] = document.querySelectorAll("nav");

        expect(first.id).not.toBe(second.id);
    });

    test("passes other attributes to the root", () => {
        const host = render('<lily-hamburger-menu data-x="1"></lily-hamburger-menu>');

        expect(host.querySelector("div.hamburger-menu")!.getAttribute("data-x")).toBe("1");
    });

    test("has no English accessible name of its own", () => {
        const host = render("<lily-hamburger-menu></lily-hamburger-menu>");

        expect(host.querySelector("button")!.hasAttribute("aria-label")).toBe(false);
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

    test("the navigation is hidden while closed, and the button controls it", () => {
        const host = render('<lily-hamburger-menu label="Main menu"></lily-hamburger-menu>');
        const button = host.querySelector("button") as HTMLButtonElement;
        const nav = host.querySelector("nav") as HTMLElement;

        expect(button.getAttribute("aria-controls")).toBe(nav.id);
        expect(nav.getAttribute("aria-label")).toBe("Main menu");
        expect(nav.hidden).toBe(true);

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

    test("moves children into the navigation", () => {
        const host = render('<lily-hamburger-menu><a href="/">Home</a></lily-hamburger-menu>');

        expect(host.querySelector("nav > a")).toBeTruthy();
        expect(host.querySelector("button > a")).toBeNull();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-hamburger-menu class="extra"></lily-hamburger-menu>');

        expect(host.querySelector("div")!.className).toBe("hamburger-menu extra");
    });
});
