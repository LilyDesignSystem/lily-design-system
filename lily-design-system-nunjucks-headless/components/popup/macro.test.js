import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("popup", () => {
    it("renders a <div role=dialog popover=auto>, closed by the browser by default", () => {
        const { document } = render("popup", { label: "X", id: "confirm" });
        const el = document.querySelector("div.popup");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("dialog");
        expect(el.getAttribute("popover")).toBe("auto");
        expect(el.getAttribute("id")).toBe("confirm");
        expect(el.hasAttribute("hidden")).toBe(false);
    });

    it("names it with label and has no English default", () => {
        const { document: a } = render("popup", { label: "Confirm deletion" });
        expect(a.querySelector("div.popup").getAttribute("aria-label")).toBe("Confirm deletion");
        const { document: b } = render("popup", {});
        expect(b.querySelector("div.popup").hasAttribute("aria-label")).toBe(false);
    });

    it("respects a custom popover mode", () => {
        const { document } = render("popup", { label: "X", popover: "manual" });
        expect(document.querySelector("div.popup").getAttribute("popover")).toBe("manual");
    });

    it("open renders it shown in place, without popover", () => {
        const { document } = render("popup", { label: "X", open: true });
        const el = document.querySelector("div.popup");
        expect(el.hasAttribute("popover")).toBe(false);
        expect(el.hasAttribute("hidden")).toBe(false);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("popup", { label: "X" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
