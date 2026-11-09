import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("panel", () => {
    it("renders a <div> with the base class when no label is given", () => {
        const { document } = render("panel", { text: "Body" });
        expect(document.querySelector("div.panel")).toBeTruthy();
        expect(document.querySelector("section.panel")).toBeNull();
        expect(document.querySelector("div.panel").hasAttribute("role")).toBe(false);
    });

    it("is a group named by its heading when a heading is provided", () => {
        const { document } = render("panel", {
            heading: "Contact",
            text: "Body",
            id: "p1",
        });
        const sec = document.querySelector("div.panel");
        expect(sec.getAttribute("role")).toBe("group");
        expect(sec.getAttribute("aria-labelledby")).toBe("p1-heading");
        const h = document.querySelector("div.panel h2.panel-heading");
        expect(h).toBeTruthy();
        expect(h.getAttribute("id")).toBe("p1-heading");
        expect(h.textContent).toBe("Contact");
    });

    it("respects a custom heading level", () => {
        const { document } = render("panel", {
            heading: "x",
            headingLevel: 3,
            text: "y",
        });
        expect(document.querySelector("div.panel h3.panel-heading")).toBeTruthy();
    });

    it("falls back to aria-label when only label is provided", () => {
        const { document } = render("panel", {
            label: "Summary",
            text: "x",
        });
        const sec = document.querySelector("div.panel");
        expect(sec.getAttribute("aria-label")).toBe("Summary");
    });

    it("wraps text body in <p> inside .panel-body", () => {
        const { document } = render("panel", { text: "Hello" });
        const p = document.querySelector(".panel-body p");
        expect(p).toBeTruthy();
        expect(p.textContent.trim()).toBe("Hello");
    });

    it("renders html raw inside .panel-body", () => {
        const { document } = render("panel", {
            html: "<ul><li>a</li></ul>",
        });
        expect(document.querySelector(".panel-body ul li")).toBeTruthy();
    });

    it("appends params.classes", () => {
        const { document } = render("panel", {
            text: "x",
            classes: "compact",
        });
        expect(document.querySelector("div.panel.compact")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("panel", { text: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("style=");
    });
});
