import { fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Subject from "../../components/NavigationMenu.vue";

describe("NavigationMenu", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Main" }, slots: { default: "content" } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Main navigation" }, slots: { default: "content" } });
        expect(screen.getByLabelText("Main navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Nav" }, slots: { default: "Home" } });
        expect(screen.getByText("Home")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "nm" }, slots: { default: "x" } });
        expect(screen.getByTestId("nm")).toBeTruthy();
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
    afterEach(() => {
        vi.unstubAllGlobals();
        delete (HTMLElement.prototype as any).clientWidth;
        delete (HTMLElement.prototype as any).offsetWidth;
    });

    const items = [0, 1, 2, 3, 4]
        .map(
            (i) =>
                `<li id="item-${i}"><a href="/${i}"${i === 1 ? ' aria-current="page"' : ""}>Item ${i}</a></li>`,
        )
        .join("");
    const mount = () =>
        render(Subject, {
            props: { label: "Main", overflow: true, moreLabel: "More" },
            slots: { default: items },
        });

    test("overflow unset renders as before: no list, no More, no data-overflow", () => {
        const { container } = render(Subject, {
            props: { label: "Main" },
            slots: { default: "content" },
        });
        expect(container.querySelector(".navigation-menu-list")).toBeNull();
        expect(container.querySelector(".navigation-menu-more")).toBeNull();
        expect(container.querySelector("nav")!.hasAttribute("data-overflow")).toBe(false);
    });

    test("publishes data-overflow and renders a hidden More item with the consumer's label", () => {
        const { container } = mount();
        expect(container.querySelector("nav")!.getAttribute("data-overflow")).toBe("true");
        expect(container.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        const button = container.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        expect(button.textContent!.trim()).toBe("More");
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("narrow: extra items move into the More list in order and More is unhidden", () => {
        width = 300;
        const { container } = mount();
        expect(container.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(false);
        const moved = Array.from(
            container.querySelector(".navigation-menu-more-list")!.children,
        ).map((c) => c.id);
        expect(moved).toEqual(["item-2", "item-3", "item-4"]);
        expect(container.querySelector('[aria-current="page"]')!.getAttribute("href")).toBe("/1");
    });

    test("the button toggles aria-expanded; Escape closes and refocuses", async () => {
        width = 300;
        const { container } = mount();
        const button = container.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        const list = container.querySelector<HTMLElement>(".navigation-menu-more-list")!;
        await fireEvent.click(button);
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(list.hidden).toBe(false);
        const link = list.querySelector("a")!;
        link.focus();
        await fireEvent.keyDown(link, { key: "Escape" });
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(list.hidden).toBe(true);
        expect(document.activeElement).toBe(button);
    });

    test("widening moves the items back and hides More", () => {
        width = 300;
        const { container } = mount();
        width = 1000;
        callbacks.forEach((cb) => cb());
        expect(container.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        expect(container.querySelector(".navigation-menu-more-list")!.children.length).toBe(0);
        expect(container.querySelector(".navigation-menu-list")!.children.length).toBe(6);
    });
});
