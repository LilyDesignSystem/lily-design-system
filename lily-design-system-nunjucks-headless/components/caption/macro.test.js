import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("caption", () => {
    it("renders a <figcaption> with the base class by default", () => {
        const { document } = render("caption", { text: "Figure 1" });
        expect(document.querySelector("figcaption.caption")).toBeTruthy();
    });

    it("is always a <figcaption>: a table's caption is the table macro's", () => {
        const { html } = render("caption", { as: "caption", text: "Table 1" });
        expect(html.trim().startsWith("<figcaption")).toBe(true);
    });

    it("escapes params.text", () => {
        const { document } = render("caption", { text: "A & B" });
        expect(document.querySelector("figcaption.caption").textContent.trim()).toBe("A & B");
    });

    it("renders params.html raw", () => {
        const { document } = render("caption", {
            html: "<strong>Figure 1</strong>",
        });
        expect(document.querySelector("figcaption.caption strong")).toBeTruthy();
    });

    it("does not name itself", () => {
        const { document } = render("caption", { text: "x", label: "Figure 1 caption" });
        expect(document.querySelector("figcaption.caption").hasAttribute("aria-label")).toBe(false);
    });

    it("appends params.classes", () => {
        const { document } = render("caption", {
            text: "x",
            classes: "small",
        });
        expect(document.querySelector("figcaption.caption.small")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("caption", { text: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
