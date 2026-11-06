import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("australia-tax-file-number-view", () => {
    it("renders a <span> with the base class", () => {
        const { document } = render("australia-tax-file-number-view", { value: "test-value" });
        const el = document.querySelector("span");
        expect(el).toBeTruthy();
        expect(el.classList.contains("australia-tax-file-number-view")).toBe(true);
    });

    it("renders the value as text content", () => {
        const { document } = render("australia-tax-file-number-view", { value: "test-value" });
        expect(document.querySelector("span").textContent).toBe("test-value");
    });

    it("sets aria-label from the label param", () => {
        const { document } = render("australia-tax-file-number-view", { value: "v", label: "lbl" });
        expect(document.querySelector(".screen-reader-span").textContent).toBe(`${"lbl"} `);
        expect(document.querySelector("span").hasAttribute("aria-label")).toBe(false);
    });

    it("appends params.classes", () => {
        const { document } = render("australia-tax-file-number-view", {
            value: "v",
            classes: "highlight",
        });
        expect(
            document.querySelector("span.australia-tax-file-number-view.highlight"),
        ).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("australia-tax-file-number-view", { value: "v" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("style=");
    });
});
