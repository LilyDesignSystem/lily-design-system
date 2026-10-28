import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { NavigationMenu } from "./navigation-menu.js";

if (!customElements.get("lily-navigation-menu")) {
    customElements.define("lily-navigation-menu", NavigationMenu);
}

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    delete (HTMLElement.prototype as any).clientWidth;
    delete (HTMLElement.prototype as any).offsetWidth;
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NavigationMenu", () => {
    test("renders a native nav", () => {
        const host = render(
            '<lily-navigation-menu label="Main navigation"><a href="/">Home</a></lily-navigation-menu>',
        );

        expect(host.querySelector("nav.navigation-menu")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-navigation-menu label="Main navigation"></lily-navigation-menu>',
        );

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Main navigation");
    });

    test("moves children into the nav", () => {
        const host = render(
            '<lily-navigation-menu label="Main navigation"><a href="/">Home</a></lily-navigation-menu>',
        );

        expect(host.querySelector("nav > a")!.textContent).toBe("Home");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(
            '<lily-navigation-menu label="Main navigation" class="extra"></lily-navigation-menu>',
        );

        expect(host.querySelector("nav")!.className).toBe("navigation-menu extra");
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-navigation-menu label="Main navigation" data-testid="nav"></lily-navigation-menu>',
        );

        expect(host.querySelector("nav")!.getAttribute("data-testid")).toBe("nav");
    });
});

// Overflow mode. jsdom has no layout, so the sizes and the ResizeObserver are stubbed.
describe("NavigationMenu overflow", () => {
    let width = 1000;
    let callbacks: Array<() => void> = [];

    beforeEach(() => {
        width = 1000;
        callbacks = [];
        vi.stubGlobal(
            "ResizeObserver",
            class {
                constructor(cb: () => void) {
                    callbacks.push(cb);
                }
                observe() {}
                disconnect() {}
            },
        );
        Object.defineProperty(HTMLElement.prototype, "clientWidth", {
            configurable: true,
            get: () => width,
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            get(this: HTMLElement) {
                return this.hidden ? 0 : this.classList.contains("navigation-menu-more") ? 40 : 100;
            },
        });
    });

    const items = [0, 1, 2, 3, 4]
        .map(
            (i) =>
                `<li id="item-${i}"><a href="/${i}"${i === 1 ? ' aria-current="page"' : ""}>Item ${i}</a></li>`,
        )
        .join("");
    const mount = () =>
        render(
            `<lily-navigation-menu label="Main" overflow more-label="More">${items}</lily-navigation-menu>`,
        );

    test("overflow unset renders as before: no list, no More, no data-overflow", () => {
        const host = render('<lily-navigation-menu label="Main"><li>x</li></lily-navigation-menu>');
        expect(host.querySelector(".navigation-menu-list")).toBeNull();
        expect(host.querySelector(".navigation-menu-more")).toBeNull();
        expect(host.querySelector("nav")!.hasAttribute("data-overflow")).toBe(false);
    });

    test("publishes data-overflow and renders a hidden More item with the consumer's label", () => {
        const host = mount();
        expect(host.querySelector("nav")!.getAttribute("data-overflow")).toBe("true");
        expect(host.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        const button = host.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        expect(button.textContent).toBe("More");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(host.querySelector("nav")!.hasAttribute("overflow")).toBe(false);
    });

    test("narrow: extra items move into the More list in order and More is unhidden", () => {
        width = 300;
        const host = mount();
        expect(host.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(false);
        const moved = Array.from(host.querySelector(".navigation-menu-more-list")!.children).map(
            (c) => c.id,
        );
        expect(moved).toEqual(["item-2", "item-3", "item-4"]);
        expect(host.querySelector('[aria-current="page"]')!.getAttribute("href")).toBe("/1");
    });

    test("the button toggles aria-expanded; Escape closes and refocuses", () => {
        width = 300;
        const host = mount();
        const button = host.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        const list = host.querySelector<HTMLElement>(".navigation-menu-more-list")!;
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(list.hidden).toBe(false);
        const link = list.querySelector("a")!;
        link.focus();
        link.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(list.hidden).toBe(true);
        expect(document.activeElement).toBe(button);
    });

    test("widening moves the items back and hides More", () => {
        width = 300;
        const host = mount();
        width = 1000;
        callbacks.forEach((cb) => cb());
        expect(host.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        expect(host.querySelector(".navigation-menu-more-list")!.children.length).toBe(0);
        expect(host.querySelector(".navigation-menu-list")!.children.length).toBe(6);
    });
});
