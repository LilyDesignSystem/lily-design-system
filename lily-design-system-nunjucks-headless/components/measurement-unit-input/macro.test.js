import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("measurement-unit-input", () => {
    it("renders a bare <input type=text> with the base class, as Svelte", () => {
        const { document } = render("measurement-unit-input", {
            id: "m",
            name: "m",
            value: "5",
            label: "Amount",
        });
        const el = document.querySelector("input.measurement-unit-input");
        expect(el.getAttribute("type")).toBe("text");
        expect(el.getAttribute("aria-label")).toBe("Amount");
        expect(el.getAttribute("name")).toBe("m");
        expect(el.getAttribute("value")).toBe("5");
    });

    it("supports required, disabled and invalid", () => {
        const el = render("measurement-unit-input", {
            required: true,
            disabled: true,
            invalid: true,
        }).document.querySelector("input");
        expect(el.hasAttribute("required")).toBe(true);
        expect(el.hasAttribute("disabled")).toBe(true);
        expect(el.getAttribute("aria-invalid")).toBe("true");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("measurement-unit-input", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
