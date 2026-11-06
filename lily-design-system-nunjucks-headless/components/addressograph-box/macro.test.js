import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("addressograph-box", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("addressograph-box", { text: "Jane Doe" });
        const el = document.querySelector("div.addressograph-box");
        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe("Jane Doe");
    });

    it("applies aria-label when label is provided", () => {
        const { document } = render("addressograph-box", {
            label: "Patient identification",
            text: "x",
        });
        expect(document.querySelector("div.addressograph-box").getAttribute("aria-label")).toBe(
            "Patient identification",
        );
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("addressograph-box", { text: "y" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("is a named group when labelled", () => {
        const { document } = render("addressograph-box", { label: "Story" }, "x");
        const root = document.querySelector(".addressograph-box");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });

    it("has no role without a label", () => {
        const { document } = render("addressograph-box", {}, "x");
        expect(document.querySelector(".addressograph-box").hasAttribute("role")).toBe(false);
    });
});
