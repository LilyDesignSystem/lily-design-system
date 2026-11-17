import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("dropdown-menu", () => {
    it("renders a <div role=menu> as a popover=auto with an id for the trigger's commandfor", () => {
        const { document } = render("dropdown-menu", { label: "X" });
        const el = document.querySelector("div.dropdown-menu");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("menu");
        expect(el.getAttribute("popover")).toBe("auto");
        expect(el.id).toBe("dropdown-menu");
        expect(el.hasAttribute("hidden")).toBe(false);
    });

    it("open renders it shown in place, without the popover attribute", () => {
        const { document } = render("dropdown-menu", { label: "X", open: true, id: "m" });
        const el = document.querySelector("div");
        expect(el.hasAttribute("popover")).toBe(false);
        expect(el.hasAttribute("hidden")).toBe(false);
        expect(el.id).toBe("m");
    });

    it("has no English default label", () => {
        const { document } = render("dropdown-menu", {});
        expect(document.querySelector("div").hasAttribute("aria-label")).toBe(false);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("dropdown-menu", { label: "X" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("subjectLabel is a non-interactive first part that names the menu", () => {
        const { document } = render("dropdown-menu", {
            id: "row-menu",
            label: "Actions",
            subjectLabel: "Ada Lovelace, blood pressure 3 Nov",
            html: '<div role="menuitem" tabindex="-1">Edit</div>',
        });
        const menu = document.querySelector("[role='menu']");
        const subject = menu.firstElementChild;
        expect(subject.className).toBe("dropdown-menu-subject");
        expect(subject.getAttribute("role")).toBe("none");
        expect(subject.textContent).toBe("Ada Lovelace, blood pressure 3 Nov");
        expect(menu.hasAttribute("aria-label")).toBe(false);
        expect(menu.getAttribute("aria-labelledby")).toBe("row-menu-subject");
        expect(subject.id).toBe("row-menu-subject");
    });
});
