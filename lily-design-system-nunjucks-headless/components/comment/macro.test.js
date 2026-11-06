import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("comment", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("comment", { text: "Helpful info." });
        const el = document.querySelector("div.comment");
        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe("Helpful info.");
    });

    it("applies aria-label when label is provided", () => {
        const { document } = render("comment", { label: "User comment", text: "x" });
        expect(document.querySelector("div.comment").getAttribute("aria-label")).toBe(
            "User comment",
        );
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("comment", { text: "y" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("is a named group when labelled", () => {
        const { document } = render("comment", { label: "Story" }, "x");
        const root = document.querySelector(".comment");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });

    it("has no role without a label", () => {
        const { document } = render("comment", {}, "x");
        expect(document.querySelector(".comment").hasAttribute("role")).toBe(false);
    });
});
