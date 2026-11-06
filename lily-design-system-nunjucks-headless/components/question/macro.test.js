import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("question", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("question", { text: "What is your name?" });
        const el = document.querySelector("div.question");
        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe("What is your name?");
    });

    it("applies aria-label when label is provided", () => {
        const { document } = render("question", { label: "Survey question", text: "x" });
        expect(document.querySelector("div.question").getAttribute("aria-label")).toBe(
            "Survey question",
        );
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("question", { text: "y" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("is a named group when labelled", () => {
        const { document } = render("question", { label: "Story" }, "x");
        const root = document.querySelector(".question");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });

    it("has no role without a label", () => {
        const { document } = render("question", {}, "x");
        expect(document.querySelector(".question").hasAttribute("role")).toBe(false);
    });
});
