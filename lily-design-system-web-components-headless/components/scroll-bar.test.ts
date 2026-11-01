import { afterEach, describe, expect, test, vi } from "vitest";

import { ScrollBar } from "./scroll-bar.js";

if (!customElements.get("lily-scroll-bar")) {
    customElements.define("lily-scroll-bar", ScrollBar);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ScrollBar", () => {
    test("renders itself with the base class and role=scrollbar", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.classList.contains("scroll-bar")).toBe(true);
        expect(host.getAttribute("role")).toBe("scrollbar");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.getAttribute("aria-label")).toBe("Chat scroll");
    });

    test("defaults to vertical orientation", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.getAttribute("aria-orientation")).toBe("vertical");
    });

    test("reflects orientation attribute", () => {
        const host = render(
            '<lily-scroll-bar label="Timeline scroll" orientation="horizontal"></lily-scroll-bar>',
        );

        expect(host.getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("sets initial value range attributes", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.getAttribute("aria-valuenow")).toBe("0");
        expect(host.getAttribute("aria-valuemin")).toBe("0");
        expect(host.getAttribute("aria-valuemax")).toBe("100");
    });

    test("renders child thumb content in place", () => {
        const host = render(
            '<lily-scroll-bar label="Chat scroll"><div data-testid="thumb"></div></lily-scroll-bar>',
        );

        expect(host.querySelector('[data-testid="thumb"]')).toBeTruthy();
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render(
            '<lily-scroll-bar label="Chat scroll" class="my-extra"></lily-scroll-bar>',
        );

        expect(host.className).toBe("scroll-bar my-extra");
    });

    test("is focusable and names the scrolled element", () => {
        const host = render(
            '<lily-scroll-bar label="Chat scroll" controls="messages"></lily-scroll-bar>',
        );

        expect(host.getAttribute("tabindex")).toBe("0");
        expect(host.getAttribute("aria-controls")).toBe("messages");
    });
});

describe("ScrollBar keyboard", () => {
    function press(host: HTMLElement, key: string) {
        const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
        host.dispatchEvent(event);
        return event;
    }

    test("arrow keys move the value by step, clamped to the range", () => {
        const host = render('<lily-scroll-bar label="S" value="1" step="2"></lily-scroll-bar>');

        expect(press(host, "ArrowDown").defaultPrevented).toBe(true);
        expect(host.getAttribute("aria-valuenow")).toBe("3");
        press(host, "ArrowRight");
        expect(host.getAttribute("aria-valuenow")).toBe("5");
        press(host, "ArrowUp");
        press(host, "ArrowLeft");
        press(host, "ArrowLeft");
        expect(host.getAttribute("aria-valuenow")).toBe("0");
    });

    test("Page Up and Page Down move the value by page-step", () => {
        const host = render(
            '<lily-scroll-bar label="S" value="50" page-step="25"></lily-scroll-bar>',
        );

        press(host, "PageDown");
        expect(host.getAttribute("aria-valuenow")).toBe("75");
        press(host, "PageDown");
        expect(host.getAttribute("aria-valuenow")).toBe("100");
        press(host, "PageUp");
        expect(host.getAttribute("aria-valuenow")).toBe("75");
    });

    test("Home and End jump to min and max; other keys pass through", () => {
        const host = render(
            '<lily-scroll-bar label="S" value="40" min="-20" max="150"></lily-scroll-bar>',
        );

        press(host, "End");
        expect(host.getAttribute("aria-valuenow")).toBe("150");
        press(host, "Home");
        expect(host.getAttribute("aria-valuenow")).toBe("-20");
        expect(press(host, "a").defaultPrevented).toBe(false);
    });

    test("each key fires lily-change with the new value", () => {
        const host = render('<lily-scroll-bar label="S" value="50"></lily-scroll-bar>');
        const seen = vi.fn();
        host.addEventListener("lily-change", (e) => seen((e as CustomEvent).detail));

        press(host, "PageUp");
        expect(seen).toHaveBeenCalledWith({ value: 40 });
        expect((host as ScrollBar).value).toBe(40);
    });
});
