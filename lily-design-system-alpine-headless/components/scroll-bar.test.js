// scroll-bar.test.js
// ScrollBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.scroll-bar");
import { snippet } from "../test/mount.js";
const press = async (target, key, init = {}) => {
    target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
    );
    await tick();
};

describe("ScrollBar", () => {
    it("renders the element with its base class", async () => {
        await mount("scroll-bar");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("scroll-bar")).toBe(true);
    });

    it('is a focusable role="scrollbar" reporting value and bounds', async () => {
        await mount("scroll-bar");
        expect(el().getAttribute("role")).toBe("scrollbar");
        expect(el().getAttribute("tabindex")).toBe("0");
        expect(el().getAttribute("aria-orientation")).toBe("vertical");
        expect(
            ["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a)),
        ).toEqual(["50", "0", "100"]);
    });
    it("Down/Right raise and Up/Left lower by one step", async () => {
        await mount("scroll-bar");
        await press(el(), "ArrowDown");
        expect(el().getAttribute("aria-valuenow")).toBe("51");
        await press(el(), "ArrowRight");
        expect(el().getAttribute("aria-valuenow")).toBe("52");
        await press(el(), "ArrowUp");
        await press(el(), "ArrowLeft");
        await press(el(), "ArrowLeft");
        expect(el().getAttribute("aria-valuenow")).toBe("49");
    });
    it("Page Down/Up move by the page step and stay inside the bounds", async () => {
        await mount("scroll-bar");
        await press(el(), "PageDown");
        expect(el().getAttribute("aria-valuenow")).toBe("60");
        for (let i = 0; i < 5; i++) await press(el(), "PageDown");
        expect(el().getAttribute("aria-valuenow")).toBe("100");
        await press(el(), "PageUp");
        expect(el().getAttribute("aria-valuenow")).toBe("90");
    });
    it("Home and End jump to the bounds", async () => {
        await mount(
            "scroll-bar",
            snippet("scroll-bar").replace(
                "lilyScrollBar(50, 0, 100, 1, 10)",
                "lilyScrollBar(50, -20, 150, 1, 10)",
            ),
        );
        await press(el(), "End");
        expect(el().getAttribute("aria-valuenow")).toBe("150");
        await press(el(), "Home");
        expect(el().getAttribute("aria-valuenow")).toBe("-20");
    });
    it("announces each change with lily:change", async () => {
        await mount("scroll-bar");
        const seen = vi.fn();
        el().addEventListener("lily:change", (e) => seen(e.detail));
        await press(el(), "PageUp");
        expect(seen).toHaveBeenCalledWith({ value: 40 });
    });
});
