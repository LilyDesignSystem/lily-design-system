import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("tour", () => {
    it("renders a <div role=dialog> with the base class and no English aria-label", () => {
        const { document } = render("tour", {});
        const el = document.querySelector("div.tour");
        expect(el).toBeTruthy();
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("respects params.label and labelledBy", () => {
        const { document: a } = render("tour", { label: "Welcome tour" });
        expect(a.querySelector("div.tour").getAttribute("aria-label")).toBe("Welcome tour");

        const { document: b } = render("tour", { label: "x", labelledBy: "h" });
        expect(b.querySelector("div.tour").getAttribute("aria-labelledby")).toBe("h");
        expect(b.querySelector("div.tour").hasAttribute("aria-label")).toBe(false);
    });

    // P18-T6: a tour is non-modal (the page it points at stays usable), so it claims no modality.
    it("is non-modal: no aria-modal", () => {
        const { document } = render("tour", { label: "T" });
        expect(document.querySelector("div.tour").hasAttribute("aria-modal")).toBe(false);
    });

    it("renders caller content", () => {
        const { document } = render("tour", {}, '<ol class="tour-list"></ol>');
        expect(document.querySelector("div.tour ol.tour-list")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("tour", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("tour keys", () => {
    it("Escape ends the tour, from inside it", () => {
        const { document } = render(
            "tour",
            { label: "Tour", active: true },
            "<button>Next</button>",
        );
        autoInit(document);
        const root = document.querySelector(".tour");
        let closed = 0;
        root.addEventListener("close", () => closed++);
        on(document.querySelector("button")).press("Escape");
        expect(closed).toBe(1);
        expect(root.getAttribute("data-active")).toBe("false");
        expect(root.hidden).toBe(true);
    });
});
