import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("ecuador-cedula-de-identidad-view", () => {
    it("renders a <span> with the base class", () => {
        const { document } = render("ecuador-cedula-de-identidad-view", { value: "test-value" });
        const el = document.querySelector("span");
        expect(el).toBeTruthy();
        expect(el.classList.contains("ecuador-cedula-de-identidad-view")).toBe(true);
    });

    it("renders the value as text content", () => {
        const { document } = render("ecuador-cedula-de-identidad-view", { value: "test-value" });
        expect(document.querySelector("span").textContent).toBe("test-value");
    });

    it("sets aria-label from the label param", () => {
        const { document } = render("ecuador-cedula-de-identidad-view", {
            value: "v",
            label: "lbl",
        });
        expect(document.querySelector(".screen-reader-span").textContent).toBe(`${"lbl"} `);
        expect(document.querySelector("span").hasAttribute("aria-label")).toBe(false);
    });

    it("appends params.classes", () => {
        const { document } = render("ecuador-cedula-de-identidad-view", {
            value: "v",
            classes: "highlight",
        });
        expect(
            document.querySelector("span.ecuador-cedula-de-identidad-view.highlight"),
        ).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("ecuador-cedula-de-identidad-view", { value: "v" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("style=");
    });
});
