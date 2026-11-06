import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("go-to-top", () => {
    it("renders a <a> with the base class", () => {
        const { document } = render("go-to-top", { label: "Test", text: "Content" });
        const el = document.querySelector(".go-to-top");
        expect(el).toBeTruthy();
    });

    it("appends params.classes to the root element", () => {
        const { document } = render("go-to-top", { label: "Test", classes: "extra" });
        const el = document.querySelector(".go-to-top.extra");
        expect(el).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("go-to-top", { label: "Test" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("is a real link, to the top by default", () => {
        expect(render("go-to-top", { text: "Top" }).document.querySelector("a").getAttribute("href")).toBe("#top");
        expect(
            render("go-to-top", { text: "Part", href: "#part" }).document.querySelector("a").getAttribute("href"),
        ).toBe("#part");
    });
});
