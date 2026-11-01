import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "warning-text";
const text =
    '<span class="visually-hidden">Warning</span> You can be fined if you do not register.';

describe("warningText", () => {
    it("renders a <div> with the base class", () => {
        expect(
            render(name, { html: text }).document.querySelector("div.warning-text"),
        ).toBeTruthy();
    });

    it("puts the base class first, then the consumer class", () => {
        expect(
            render(name, { classes: "mine", html: text })
                .document.querySelector(".warning-text")
                .getAttribute("class"),
        ).toBe("warning-text mine");
    });

    it("renders html, text and caller content inside strong.warning-text-text", () => {
        const strong = render(name, { html: text }).document.querySelector(
            ".warning-text > strong.warning-text-text",
        );
        expect(strong.querySelector(".visually-hidden").textContent).toBe("Warning");
        expect(strong.textContent).toContain("You can be fined");
        expect(
            render(name, { text: "<b>x</b>" }).document.querySelector(".warning-text-text")
                .textContent,
        ).toBe("<b>x</b>");
        expect(
            render(name, {}, "<span>called</span>").document.querySelector(
                ".warning-text-text span",
            ).textContent,
        ).toBe("called");
    });

    it("renders iconText or iconHtml first, inside an aria-hidden wrapper", () => {
        const doc = render(name, { iconText: "!", html: text }).document;
        const wrap = doc.querySelector(".warning-text > .warning-text-icon");
        expect(wrap.getAttribute("aria-hidden")).toBe("true");
        expect(wrap.textContent).toBe("!");
        expect(doc.querySelector(".warning-text").firstElementChild).toBe(wrap);
        expect(
            render(name, { iconHtml: "<svg></svg>", html: text }).document.querySelector(
                ".warning-text-icon svg",
            ),
        ).toBeTruthy();
    });

    it("renders no icon wrapper when no icon is supplied", () => {
        expect(
            render(name, { html: text }).document.querySelector(".warning-text-icon"),
        ).toBeNull();
    });

    it("adds no role and no text of its own", () => {
        const el = render(name, {}).document.querySelector(".warning-text");
        expect(el.getAttribute("role")).toBeNull();
        expect(el.textContent.trim()).toBe("");
    });

    it("sets id and extra attributes", () => {
        const el = render(name, {
            id: "x1",
            attributes: { "data-x": "1" },
            html: text,
        }).document.querySelector(".warning-text");
        expect(el.getAttribute("id")).toBe("x1");
        expect(el.getAttribute("data-x")).toBe("1");
    });

    it("contains no <style> or <script> tags or inline styles", () => {
        const { html } = render(name, { iconText: "!", html: text });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("style=");
    });
});
