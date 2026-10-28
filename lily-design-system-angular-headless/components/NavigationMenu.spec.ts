import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { NavigationMenu } from "./NavigationMenu";

describe("NavigationMenu", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(NavigationMenu);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.navigation-menu");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(NavigationMenu);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.navigation-menu");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

// Overflow mode. jsdom has no layout, so the sizes and the ResizeObserver are stubbed.
@Component({
    standalone: true,
    imports: [NavigationMenu],
    template: `<lily-navigation-menu label="Main" [overflow]="overflow" moreLabel="More">
        <li id="item-0"><a href="/0">Item 0</a></li>
        <li id="item-1"><a href="/1" aria-current="page">Item 1</a></li>
        <li id="item-2"><a href="/2">Item 2</a></li>
        <li id="item-3"><a href="/3">Item 3</a></li>
        <li id="item-4"><a href="/4">Item 4</a></li>
    </lily-navigation-menu>`,
})
class Host {
    overflow = true;
}

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
        Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => width });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            get(this: HTMLElement) {
                return this.hidden ? 0 : this.classList.contains("navigation-menu-more") ? 40 : 100;
            },
        });
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        delete (HTMLElement.prototype as any).clientWidth;
        delete (HTMLElement.prototype as any).offsetWidth;
    });

    async function mount(overflow = true) {
        const fixture = TestBed.createComponent(Host);
        fixture.componentInstance.overflow = overflow;
        fixture.detectChanges();
        await fixture.whenStable();
        return fixture.nativeElement as HTMLElement;
    }

    test("overflow unset renders as before: no list, no More, no data-overflow", async () => {
        const el = await mount(false);
        expect(el.querySelector(".navigation-menu-list")).toBeNull();
        expect(el.querySelector(".navigation-menu-more")).toBeNull();
        expect(el.querySelector(".navigation-menu")!.hasAttribute("data-overflow")).toBe(false);
        expect(el.querySelectorAll("li").length).toBe(5);
    });

    test("publishes data-overflow and renders a hidden More item with the consumer's label", async () => {
        const el = await mount();
        expect(el.querySelector(".navigation-menu")!.getAttribute("data-overflow")).toBe("true");
        expect(el.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        const button = el.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        expect(button.textContent!.trim()).toBe("More");
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("narrow: extra items move into the More list in order and More is unhidden", async () => {
        width = 300;
        const el = await mount();
        expect(el.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(false);
        const moved = Array.from(el.querySelector(".navigation-menu-more-list")!.children).map((c) => c.id);
        expect(moved).toEqual(["item-2", "item-3", "item-4"]);
        expect(el.querySelector('[aria-current="page"]')!.getAttribute("href")).toBe("/1");
    });

    test("the button toggles aria-expanded; Escape closes and refocuses", async () => {
        width = 300;
        const el = await mount();
        const button = el.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        const list = el.querySelector<HTMLElement>(".navigation-menu-more-list")!;
        document.body.appendChild(el);
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

    test("widening moves the items back and hides More", async () => {
        width = 300;
        const el = await mount();
        width = 1000;
        callbacks.forEach((cb) => cb());
        expect(el.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        expect(el.querySelector(".navigation-menu-more-list")!.children.length).toBe(0);
        expect(el.querySelector(".navigation-menu-list")!.children.length).toBe(6);
    });
});
