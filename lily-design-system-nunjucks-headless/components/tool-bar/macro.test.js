import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("tool-bar", () => {
    it("renders a <div role=toolbar> with the base class", () => {
        const { document } = render("tool-bar", { label: "X" });
        const el = document.querySelector("div.tool-bar");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("toolbar");
        expect(el.getAttribute("aria-label")).toBe("X");
    });

    it("has no English aria-label of its own", () => {
        const { document } = render("tool-bar", {});
        expect(document.querySelector("div.tool-bar").hasAttribute("aria-label")).toBe(false);
    });

    it("prefers labelledBy over label", () => {
        const { document } = render("tool-bar", { label: "x", labelledBy: "h" });
        const el = document.querySelector("div.tool-bar");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("renders caller content", () => {
        const { document } = render("tool-bar", { label: "x" }, '<span class="child"></span>');
        expect(document.querySelector("div.tool-bar .child")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("tool-bar", { label: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("tool-bar keys", () => {
    it("moves between its buttons and wraps", () => {
        const { document } = render(
            "tool-bar",
            { label: "Tools" },
            "<button>A</button><button>B</button>",
        );
        autoInit(document);
        const [a, b] = document.querySelectorAll("button");
        on(a).press("ArrowRight");
        expect(document.activeElement).toBe(b);
        on(b).press("ArrowRight");
        expect(document.activeElement).toBe(a);
        on(a).press("End");
        expect(document.activeElement).toBe(b);
    });
});
