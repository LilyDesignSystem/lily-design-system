import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view", () => {
    it("renders a <span> with the base class", () => {
        const { document } = render(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            {
                value: "test-value",
            },
        );
        const el = document.querySelector("span");
        expect(el).toBeTruthy();
        expect(
            el.classList.contains(
                "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            ),
        ).toBe(true);
    });

    it("renders the value as text content", () => {
        const { document } = render(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            {
                value: "test-value",
            },
        );
        expect(document.querySelector("span").textContent).toBe("test-value");
    });

    it("sets aria-label from the label param", () => {
        const { document } = render(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            {
                value: "v",
                label: "lbl",
            },
        );
        expect(document.querySelector(".screen-reader-span").textContent).toBe(`${"lbl"} `);
        expect(document.querySelector("span").hasAttribute("aria-label")).toBe(false);
    });

    it("appends params.classes", () => {
        const { document } = render(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            {
                value: "v",
                classes: "highlight",
            },
        );
        expect(
            document.querySelector(
                "span.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view.highlight",
            ),
        ).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            { value: "v" },
        );
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("style=");
    });
});
