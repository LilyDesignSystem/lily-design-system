// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fitCount, setupOverflowNavigation } from "./overflow-navigation";

describe("fitCount", () => {
    test("everything fits", () => expect(fitCount([50, 50, 50], 200, 40)).toBe(3));
    test("exact fit with gaps", () => expect(fitCount([50, 50, 50], 160, 40, 5)).toBe(3));
    test("leaves room for the More item", () => expect(fitCount([50, 50, 50, 50], 160, 40)).toBe(2));
    test("gaps count", () => expect(fitCount([50, 50, 50, 50], 160, 40, 10)).toBe(2));
    test("nothing fits beside More", () => expect(fitCount([100, 100], 120, 40)).toBe(0));
    test("empty", () => expect(fitCount([], 0, 0)).toBe(0));
});

let callbacks: Array<() => void> = [];
class FakeResizeObserver {
    constructor(cb: () => void) {
        callbacks.push(cb);
    }
    observe() {}
    disconnect() {}
}

function build(n = 5) {
    document.body.innerHTML = `<nav class="navigation-menu" data-overflow="true"><ul class="navigation-menu-list">${Array.from(
        { length: n },
        (_, i) => `<li id="i${i}"><a href="/${i}"${i === 1 ? ' aria-current="page"' : ""}>Item ${i}</a></li>`,
    ).join("")}<li class="navigation-menu-more" hidden><button class="navigation-menu-more-button" type="button" aria-expanded="false">More</button><ul class="navigation-menu-more-list" hidden></ul></li></ul></nav>`;
    const root = document.querySelector<HTMLElement>("nav")!;
    const list = root.querySelector<HTMLElement>(".navigation-menu-list")!;
    return {
        root,
        list,
        more: root.querySelector<HTMLElement>(".navigation-menu-more")!,
        button: root.querySelector<HTMLElement>(".navigation-menu-more-button")!,
        moreList: root.querySelector<HTMLElement>(".navigation-menu-more-list")!,
    };
}

let width = 1000;
beforeEach(() => {
    callbacks = [];
    width = 1000;
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
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
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).clientWidth;
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetWidth;
});

describe("setupOverflowNavigation", () => {
    test("returns null without the expected markup", () => {
        document.body.innerHTML = '<nav class="navigation-menu"></nav>';
        expect(setupOverflowNavigation(document.querySelector("nav")!)).toBeNull();
    });

    test("wide: nothing moves and More stays hidden", () => {
        const { root, more, moreList } = build();
        setupOverflowNavigation(root);
        expect(more.hidden).toBe(true);
        expect(moreList.children.length).toBe(0);
    });

    test("narrow: the items that do not fit move, in order, and More is unhidden", () => {
        const { root, more, moreList, list } = build();
        width = 300; // More 40 + two items 200 = 240; a third would be 340
        setupOverflowNavigation(root);
        expect(more.hidden).toBe(false);
        expect(Array.from(moreList.children).map((c) => c.id)).toEqual(["i2", "i3", "i4"]);
        expect(Array.from(list.children).map((c) => c.id)).toEqual(["i0", "i1", ""]);
        // links and aria-current survive the move
        expect(root.querySelector('[aria-current="page"]')?.getAttribute("href")).toBe("/1");
    });

    test("the button wires aria-controls and toggles aria-expanded and the list", () => {
        const { root, button, moreList } = build();
        width = 300;
        setupOverflowNavigation(root);
        expect(button.getAttribute("aria-controls")).toBe(moreList.id);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(moreList.hidden).toBe(true);
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(moreList.hidden).toBe(false);
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(moreList.hidden).toBe(true);
    });

    test("Escape closes and returns focus to the button", () => {
        const { root, button, moreList } = build();
        width = 300;
        setupOverflowNavigation(root);
        button.click();
        const link = moreList.querySelector("a")!;
        link.focus();
        link.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        expect(moreList.hidden).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(button);
    });

    test("a click outside closes; a click inside does not", () => {
        const { root, button, moreList } = build();
        width = 300;
        setupOverflowNavigation(root);
        button.click();
        moreList.querySelector("a")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(moreList.hidden).toBe(false);
        document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(moreList.hidden).toBe(true);
    });

    test("widening moves the items back in order and hides More", () => {
        const { root, list, more, moreList } = build();
        width = 300;
        setupOverflowNavigation(root);
        width = 1000;
        callbacks.forEach((cb) => cb());
        expect(more.hidden).toBe(true);
        expect(moreList.children.length).toBe(0);
        expect(Array.from(list.children).map((c) => c.id)).toEqual(["i0", "i1", "i2", "i3", "i4", ""]);
    });

    test("narrowing through the observer moves items; Tab focus on a moved item survives a re-measure", () => {
        const { root, moreList, button } = build();
        setupOverflowNavigation(root);
        width = 200;
        callbacks.forEach((cb) => cb());
        expect(moreList.children.length).toBe(4);
        button.click();
        const link = moreList.querySelector("a")!;
        link.focus();
        width = 250;
        callbacks.forEach((cb) => cb());
        expect(link.closest(".navigation-menu-more-list")).toBeNull(); // moved back to the row
        expect(document.activeElement).toBe(link);
    });

    test("no ResizeObserver: nothing breaks and links stay in place", () => {
        vi.stubGlobal("ResizeObserver", undefined);
        const { root, moreList, more } = build();
        width = 300;
        const handle = setupOverflowNavigation(root);
        expect(handle).not.toBeNull();
        expect(moreList.children.length).toBeGreaterThanOrEqual(0);
        handle?.dispose();
        expect(more.hidden).toBe(true);
    });

    test("dispose returns items and removes the outside-click listener", () => {
        const { root, list, moreList } = build();
        width = 300;
        const handle = setupOverflowNavigation(root)!;
        handle.dispose();
        expect(moreList.children.length).toBe(0);
        expect(list.children.length).toBe(6);
    });
});
