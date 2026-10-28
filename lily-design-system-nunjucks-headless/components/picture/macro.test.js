import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "picture";
const parts =
    '<source srcset="wide.webp" media="(min-width: 800px)" type="image/webp"><img src="small.jpg" alt="A lily" width="320" height="200">';

describe("picture", () => {
    it("renders a <picture> with the base class", () => {
        expect(
            render(name, { html: parts }).document.querySelector("picture.picture"),
        ).toBeTruthy();
    });

    it("puts the base class first, then the consumer class", () => {
        expect(
            render(name, { classes: "mine", html: parts })
                .document.querySelector("picture")
                .getAttribute("class"),
        ).toBe("picture mine");
    });

    it("renders html and caller content, keeping the consumer's alt", () => {
        const a = render(name, { html: parts }).document;
        expect(a.querySelector("picture > source").getAttribute("media")).toBe(
            "(min-width: 800px)",
        );
        expect(a.querySelector("picture > img").getAttribute("alt")).toBe("A lily");
        expect(
            render(name, {}, '<img src="a.jpg" alt="b">').document.querySelector("picture > img"),
        ).toBeTruthy();
    });

    it("sets id and extra attributes", () => {
        const el = render(name, {
            id: "x1",
            attributes: { "data-x": "1" },
            html: parts,
        }).document.querySelector("picture");
        expect(el.getAttribute("id")).toBe("x1");
        expect(el.getAttribute("data-x")).toBe("1");
    });

    it("contains no <style> or <script> tags or inline styles", () => {
        const { html } = render(name, { html: parts });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("style=");
    });
});
