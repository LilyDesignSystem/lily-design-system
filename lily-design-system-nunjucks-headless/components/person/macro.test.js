import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("person", () => {
    it("renders an <article> with the person's name as label", () => {
        const { document } = render("person", { name: "Dr Patel", role: "GP" });
        const el = document.querySelector("article.person");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBeNull();
        expect(el.getAttribute("aria-label")).toBe("Dr Patel");
        expect(document.querySelector(".person-name").textContent.trim()).toBe("Dr Patel");
        expect(document.querySelector(".person-role").textContent.trim()).toBe("GP");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("person", { name: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
