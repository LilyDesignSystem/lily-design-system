import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("dial", () => {
    it("renders an <input type=range> with the base class", () => {
        const { document } = render("dial", {
            id: "d",
            value: 50,
            label: "Volume",
        });
        const el = document.querySelector("input.dial");
        expect(el).toBeTruthy();
        expect(el.getAttribute("type")).toBe("range");
        expect(el.getAttribute("aria-label")).toBe("Volume");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("dial", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("dial keys", () => {
    it("Shift moves ten steps, and a plain arrow stays the browser's", () => {
        const { document } = render("dial", { label: "Volume", value: 50 });
        autoInit(document);
        const dial = document.querySelector(".dial");
        expect(on(dial).press("ArrowRight", { shiftKey: true }).defaultPrevented).toBe(true);
        expect(dial.value).toBe("60");
        on(dial).press("ArrowDown", { shiftKey: true });
        expect(dial.value).toBe("50");
        expect(on(dial).press("ArrowRight").defaultPrevented).toBe(false);
    });
});
