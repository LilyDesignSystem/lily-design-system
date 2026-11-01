// tour-list.test.js
// TourList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.tour-list");
const press = async (target, key, init = {}) => {
    target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
    );
    await tick();
};

describe("TourList", () => {
    it("renders the element with its base class", async () => {
        await mount("tour-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("tour-list")).toBe(true);
    });

    it("is a focusable, shown list while active", async () => {
        await mount("tour-list");
        expect(el().tagName).toBe("OL");
        expect(el().hasAttribute("role")).toBe(false);
        expect(el().getAttribute("tabindex")).toBe("-1");
        expect(el().hidden).toBe(false);
    });
    it("Escape inside the list closes it and dispatches lily:close", async () => {
        await mount("tour-list");
        const closed = vi.fn();
        el().addEventListener("lily:close", closed);
        el().innerHTML = '<li class="tour-list-item"><button>Next</button></li>';
        await press(el().querySelector("button"), "Escape");
        expect(el().hidden).toBe(true);
        expect(closed).toHaveBeenCalledTimes(1);
        await press(el(), "Escape");
        expect(closed).toHaveBeenCalledTimes(1);
    });
    it("other keys leave it open", async () => {
        await mount("tour-list");
        await press(el(), "Enter");
        await press(el(), "Tab");
        expect(el().hidden).toBe(false);
    });
});
