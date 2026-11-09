import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("measurement-unit-view", () => {
    it("renders a <span> with the unit symbol", () => {
        const { document } = render("measurement-unit-view", {
            unit: "cm",
            unitLabel: "centimetres",
        });
        const el = document.querySelector("span.measurement-unit-view");
        expect(el).toBeTruthy();
        expect(el.querySelector("abbr").getAttribute("title")).toBe("centimetres");
        expect(el.textContent.trim()).toBe("cm");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("measurement-unit-view", { unit: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
