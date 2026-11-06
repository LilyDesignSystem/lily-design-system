import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("draft", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("draft", { text: "Working title" });
        const el = document.querySelector("div.draft");
        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe("Working title");
    });

    it("applies aria-label when label is provided", () => {
        const { document } = render("draft", { label: "Draft article", text: "x" });
        expect(document.querySelector("div.draft").getAttribute("aria-label")).toBe(
            "Draft article",
        );
    });

    it("applies data-status when status is provided", () => {
        const { document } = render("draft", { status: "in-progress", text: "x" });
        expect(document.querySelector("div.draft").getAttribute("data-status")).toBe("in-progress");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("draft", { text: "y" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("is a named group when labelled", () => {
        const { document } = render("draft", { label: "Story" }, "x");
        const root = document.querySelector(".draft");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });

    it("has no role without a label", () => {
        const { document } = render("draft", {}, "x");
        expect(document.querySelector(".draft").hasAttribute("role")).toBe(false);
    });
});
