import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("footnote", () => {
    it('renders a <span role="note"> with the base class and the reference\'s target id', () => {
        const { document } = render("footnote", { id: "fn-1", text: "Source: WHO 2024 report." });
        const el = document.querySelector("span.footnote");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("note");
        expect(el.getAttribute("id")).toBe("fn-1");
        expect(el.textContent).toBe("Source: WHO 2024 report.");
    });

    it("is not named by its id", () => {
        const { document } = render("footnote", { id: "fn-1", text: "Source" });
        expect(document.querySelector(".footnote").hasAttribute("aria-label")).toBe(false);
    });

    it("renders html content", () => {
        const { document } = render("footnote", { id: "fn-2", html: "<em>Journal</em>, 2024" });
        expect(document.querySelector(".footnote em").textContent).toBe("Journal");
    });

    it("appends params.classes", () => {
        const { document } = render("footnote", { id: "fn-1", text: "x", classes: "inline" });
        expect(document.querySelector("span.footnote.inline")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("footnote", { id: "fn-1", text: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
