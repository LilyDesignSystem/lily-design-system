import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("qr-code-image", () => {
    it("renders a <div role=img> named by label, with a presentational image", () => {
        const { document } = render("qr-code-image", {
            id: "q",
            src: "/qr.png",
            label: "Scan to visit example.com",
            size: 128,
        });
        const el = document.querySelector("div.qr-code-image");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Scan to visit example.com");
        const img = el.querySelector("img");
        expect(img.getAttribute("alt")).toBe("");
        expect(img.getAttribute("width")).toBe("128");
    });

    it("takes alt as the name, for older calls", () => {
        const el = render("qr-code-image", { src: "/qr.png", alt: "Pay" }).document.querySelector(
            ".qr-code-image",
        );
        expect(el.getAttribute("aria-label")).toBe("Pay");
    });

    it("holds the consumer's SVG when no src is given", () => {
        const { document } = render("qr-code-image", { label: "Scan" }, "<svg></svg>");
        expect(document.querySelector(".qr-code-image svg")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("qr-code-image", { src: "/q.png" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
