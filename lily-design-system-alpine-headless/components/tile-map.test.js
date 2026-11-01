// tile-map.test.js
// TileMap component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tile-map");
const press = async (target, key, init = {}) => {
    target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
    );
    await tick();
};
// A 3 x 2 grid: a b c / d e f. jsdom has no layout, so each tile reports its own box.
const fill = () => {
    el().innerHTML = ["a", "b", "c", "d", "e", "f"]
        .map((t) => '<div data-tile tabindex="0">' + t + "</div>")
        .join("");
    [...el().querySelectorAll("[data-tile]")].forEach((tile, i) => {
        const left = (i % 3) * 10,
            top = Math.floor(i / 3) * 10;
        tile.getBoundingClientRect = () => ({
            left,
            top,
            width: 10,
            height: 10,
            right: left + 10,
            bottom: top + 10,
        });
    });
    el().querySelector("[data-tile]").focus();
};
const tile = (t) => [...el().querySelectorAll("[data-tile]")].find((e) => e.textContent === t);
const focused = () => document.activeElement.textContent;

describe("TileMap", () => {
    it("renders the element with its base class", async () => {
        await mount("tile-map");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("tile-map")).toBe(true);
    });

    it('is role="img" named as a tile map', async () => {
        await mount("tile-map");
        expect(el().getAttribute("role")).toBe("img");
        expect(el().getAttribute("aria-roledescription")).toBe("tile map");
    });
    it("ArrowRight and ArrowLeft step through the tiles and stop at the ends", async () => {
        await mount("tile-map");
        fill();
        await press(document.activeElement, "ArrowLeft");
        expect(focused()).toBe("a");
        await press(document.activeElement, "ArrowRight");
        await press(document.activeElement, "ArrowRight");
        expect(focused()).toBe("c");
        tile("f").focus();
        await press(document.activeElement, "ArrowRight");
        expect(focused()).toBe("f");
    });
    it("ArrowDown and ArrowUp go to the nearest tile in the next or previous row", async () => {
        await mount("tile-map");
        fill();
        tile("b").focus();
        await press(document.activeElement, "ArrowDown");
        expect(focused()).toBe("e");
        await press(document.activeElement, "ArrowDown");
        expect(focused()).toBe("e");
        tile("f").focus();
        await press(document.activeElement, "ArrowUp");
        expect(focused()).toBe("c");
    });
    it("a nearer row wins over a tile further down that is directly below", async () => {
        await mount("tile-map");
        fill();
        // "b" sits one row down, slightly to the right; "f" sits two rows down, directly below "a".
        const box = (left, top) => () => ({
            left,
            top,
            width: 10,
            height: 10,
            right: left + 10,
            bottom: top + 10,
        });
        tile("a").getBoundingClientRect = box(0, 0);
        tile("b").getBoundingClientRect = box(5, 10);
        tile("f").getBoundingClientRect = box(0, 20);
        for (const t of ["c", "d", "e"]) tile(t).getBoundingClientRect = box(100, 0);
        tile("a").focus();
        await press(document.activeElement, "ArrowDown");
        expect(focused()).toBe("b");
    });
    it("Enter and Space dispatch tile-activate on the focused tile", async () => {
        await mount("tile-map");
        fill();
        const seen = [];
        el().addEventListener("tile-activate", (e) => seen.push(e.target.textContent));
        tile("d").focus();
        await press(document.activeElement, "Enter");
        await press(document.activeElement, " ");
        expect(seen).toEqual(["d", "d"]);
    });
    it("Escape deselects the focused tile", async () => {
        await mount("tile-map");
        fill();
        await press(document.activeElement, "Escape");
        expect(document.activeElement).toBe(document.body);
    });
});
