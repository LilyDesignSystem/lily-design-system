import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tour-list", () => {
    it("renders an <ol> with the base class", () => {
        const { document } = render("tour-list", {});
        expect(document.querySelector("ol.tour-list")).toBeTruthy();
    });

    // P18-T6: a list of steps, not a dialog: no role (it would hide the list semantics), no aria-modal.
    it("keeps list semantics: no role, no aria-modal", () => {
        const { document } = render("tour-list", {});
        const el = document.querySelector("ol");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-modal")).toBe(false);
    });

    it("renders caller content", () => {
        const { document } = render("tour-list", {}, '<li class="tour-list-item"></li>');
        expect(document.querySelector("ol.tour-list li.tour-list-item")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("tour-list", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
