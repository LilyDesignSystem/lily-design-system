import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("editable-form", () => {
    it("renders a <form> with the base class", () => {
        const { document } = render("editable-form", { label: "Edit name" });
        const el = document.querySelector("form.editable-form");
        expect(el).toBeTruthy();
        expect(el.getAttribute("aria-label")).toBe("Edit name");
        expect(el.getAttribute("method")).toBe("post");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("editable-form", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("editable-form keys", () => {
    it("Escape cancels and leaves edit mode", () => {
        const { document } = render("editable-form", { label: "Edit", editing: true }, "<input>");
        autoInit(document);
        const form = document.querySelector("form");
        let cancelled = 0;
        form.addEventListener("cancel", () => cancelled++);
        on(document.querySelector("input")).press("Escape");
        expect(cancelled).toBe(1);
        expect(form.getAttribute("data-editing")).toBe("false");
        expect(form.hidden).toBe(true);
    });

    it("editing: false renders it hidden", () => {
        const { document } = render("editable-form", { label: "Edit", editing: false });
        expect(document.querySelector("form").hidden).toBe(true);
    });
});
