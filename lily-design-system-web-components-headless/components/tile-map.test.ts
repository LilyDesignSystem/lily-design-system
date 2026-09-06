import { afterEach, describe, expect, test, vi } from "vitest";

import { TileMap } from "./tile-map.js";

if (!customElements.get("lily-tile-map")) {
    customElements.define("lily-tile-map", TileMap);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

function rect(left: number, top: number, width = 20, height = 20): DOMRect {
    return {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON() {
            return this;
        },
    } as DOMRect;
}

describe("TileMap", () => {
    test("carries the base class, role=img, and aria-roledescription", () => {
        const host = render('<lily-tile-map label="US election results by state"></lily-tile-map>');

        expect(host.classList.contains("tile-map")).toBe(true);
        expect(host.getAttribute("role")).toBe("img");
        expect(host.getAttribute("aria-roledescription")).toBe("tile map");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tile-map label="European population density"></lily-tile-map>');

        expect(host.getAttribute("aria-label")).toBe("European population density");
    });

    test("preserves the consumer's tile children", () => {
        const host = render(
            '<lily-tile-map label="Map"><div data-tile tabindex="0">ME</div><div data-tile tabindex="0">AK</div></lily-tile-map>',
        );

        expect(host.querySelectorAll("[data-tile]").length).toBe(2);
    });

    test("ArrowRight moves focus to the next tile, ArrowLeft to the previous", () => {
        const host = render(
            '<lily-tile-map label="Map"><div data-tile tabindex="0" id="a">A</div><div data-tile tabindex="0" id="b">B</div></lily-tile-map>',
        );
        const a = host.querySelector("#a") as HTMLElement;
        const b = host.querySelector("#b") as HTMLElement;
        a.focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(b);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        expect(document.activeElement).toBe(a);
    });

    test("ArrowDown moves focus to the nearest tile below", () => {
        const host = render(
            '<lily-tile-map label="Map"><div data-tile tabindex="0" id="top">Top</div><div data-tile tabindex="0" id="bottom">Bottom</div></lily-tile-map>',
        );
        const top = host.querySelector("#top") as HTMLElement;
        const bottom = host.querySelector("#bottom") as HTMLElement;
        top.getBoundingClientRect = () => rect(0, 0);
        bottom.getBoundingClientRect = () => rect(0, 40);
        top.focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

        expect(document.activeElement).toBe(bottom);
    });

    test("Enter dispatches tile-activate on the focused tile", () => {
        const host = render('<lily-tile-map label="Map"><div data-tile tabindex="0" id="a">A</div></lily-tile-map>');
        const a = host.querySelector("#a") as HTMLElement;
        const handler = vi.fn();
        a.addEventListener("tile-activate", handler);
        a.focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("Space dispatches tile-activate on the focused tile", () => {
        const host = render('<lily-tile-map label="Map"><div data-tile tabindex="0" id="a">A</div></lily-tile-map>');
        const a = host.querySelector("#a") as HTMLElement;
        const handler = vi.fn();
        a.addEventListener("tile-activate", handler);
        a.focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("Escape blurs the focused tile", () => {
        const host = render('<lily-tile-map label="Map"><div data-tile tabindex="0" id="a">A</div></lily-tile-map>');
        const a = host.querySelector("#a") as HTMLElement;
        a.focus();
        expect(document.activeElement).toBe(a);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(document.activeElement).not.toBe(a);
    });
});
