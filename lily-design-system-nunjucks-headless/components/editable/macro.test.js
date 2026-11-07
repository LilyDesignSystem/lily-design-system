import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("editable", () => {
    it("renders a <span> with role=textbox and contenteditable", () => {
        const { document } = render("editable", { text: "Click to edit" });
        const el = document.querySelector("span.editable");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("textbox");
        expect(el.getAttribute("contenteditable")).toBe("false");
    });

    it("sets contenteditable=true when editing", () => {
        const { document } = render("editable", { text: "x", editing: true });
        expect(document.querySelector("span").getAttribute("contenteditable")).toBe("true");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("editable", { text: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("editable keys", () => {
    it("Enter begins and keeps, Escape puts it back", () => {
        const { document } = render("editable", { label: "Name", text: "Ada" });
        autoInit(document);
        const root = document.querySelector(".editable");
        const kept = [];
        root.addEventListener("editable-change", (event) => kept.push(event.detail.value));
        on(root).press("Enter");
        expect(root.getAttribute("contenteditable")).toBe("true");
        root.textContent = "Grace";
        on(root).press("Enter");
        expect(root.getAttribute("contenteditable")).toBe("false");
        expect(kept).toEqual(["Grace"]);
        on(root).press(" ");
        root.textContent = "Lost";
        on(root).press("Escape");
        expect(root.textContent).toBe("Grace");
        expect(kept).toEqual(["Grace"]);
    });
});
