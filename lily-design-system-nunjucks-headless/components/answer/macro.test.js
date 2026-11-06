import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("answer", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("answer", { text: "My name is Alex." });
        const el = document.querySelector("div.answer");
        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe("My name is Alex.");
    });

    it("applies aria-label when label is provided", () => {
        const { document } = render("answer", { label: "Survey answer", text: "x" });
        expect(document.querySelector("div.answer").getAttribute("aria-label")).toBe(
            "Survey answer",
        );
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("answer", { text: "y" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("is a named group when labelled", () => {
        const { document } = render("answer", { label: "Story" }, "x");
        const root = document.querySelector(".answer");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });

    it("has no role without a label", () => {
        const { document } = render("answer", {}, "x");
        expect(document.querySelector(".answer").hasAttribute("role")).toBe(false);
    });
});
