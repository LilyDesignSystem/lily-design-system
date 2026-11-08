import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("character-counter", () => {
    it("renders an <output aria-live=polite> with the numbers alone, as Svelte does: no English", () => {
        const { document } = render("character-counter", { value: 42, maximum: 100 });
        const el = document.querySelector("output.character-counter");
        expect(el).toBeTruthy();
        expect(el.getAttribute("aria-live")).toBe("polite");
        expect(el.textContent.trim()).toBe("42 / 100");
    });

    it("omits the maximum when none is provided", () => {
        const { document } = render("character-counter", { value: 5 });
        expect(document.querySelector("output").textContent.trim()).toBe("5");
    });

    it("respects the 'for' attribute", () => {
        const { document } = render("character-counter", { value: 0, for: "msg" });
        expect(document.querySelector("output").getAttribute("for")).toBe("msg");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("character-counter", { value: 0 });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("shows the consumer's own words when given text", () => {
        const { document } = render("character-counter", {
            value: 3,
            maximum: 10,
            text: "3 de 10 caractères",
        });
        expect(document.querySelector("output").textContent.trim()).toBe("3 de 10 caractères");
    });

    it("renders data-count, data-max, data-remaining, and data-over-limit past the maximum", () => {
        const el = render("character-counter", { value: 42, maximum: 100 }).document.querySelector(
            "output",
        );
        expect([el.dataset.count, el.dataset.max, el.dataset.remaining]).toEqual([
            "42",
            "100",
            "58",
        ]);
        expect(el.hasAttribute("data-over-limit")).toBe(false);
        const over = render("character-counter", { count: 120, max: 100 }).document.querySelector(
            "output",
        );
        expect(over.hasAttribute("data-over-limit")).toBe(true);
        expect(over.dataset.remaining).toBe("-20");
    });
});
