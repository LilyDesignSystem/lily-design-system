import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

const items =
    '<li role="treeitem" aria-expanded="true" tabindex="0">src<ul role="group"><li role="treeitem" tabindex="-1">a.js</li></ul></li><li role="treeitem" tabindex="-1">README</li>';
const r = (x = {}) => render("file-tree", { label: "Files", ...x }, items).document;
describe("file-tree", () => {
    it("renders <ul role=tree> with the base class", () => {
        const el = r().querySelector("ul.file-tree");
        expect(el.getAttribute("role")).toBe("tree");
    });
    it("uses label as aria-label", () => {
        expect(r().querySelector(".file-tree").getAttribute("aria-label")).toBe("Files");
    });
    it("renders consumer treeitems and nested groups untouched", () => {
        const d = r();
        expect(d.querySelectorAll("[role=treeitem]").length).toBe(3);
        expect(d.querySelector("[role=group] [role=treeitem]")).toBeTruthy();
    });
    it("preserves exactly one tab stop from the markup", () => {
        expect(r().querySelectorAll("[tabindex='0']").length).toBe(1);
    });
    it("carries the data-module hook for consumer keyboard script", () => {
        expect(r().querySelector(".file-tree").getAttribute("data-module")).toBe("file-tree");
    });
    it("appends classes and spreads attributes on the root", () => {
        const el = r({ classes: "extra", attributes: { "data-x": "1" } }).querySelector(
            ".file-tree",
        );
        expect(el.classList.contains("extra")).toBe(true);
        expect(el.getAttribute("data-x")).toBe("1");
    });
    it("contains no <style> or <script> tags", () => {
        const { html } = render("file-tree", { label: "F" });
        expect(html).not.toMatch(/<(style|script)/);
    });
});

describe("file-tree keys", () => {
    const items =
        '<li role="treeitem" aria-expanded="false" tabindex="0">src<ul role="group">' +
        '<li role="treeitem" tabindex="-1">app.js</li></ul></li>' +
        '<li role="treeitem" tabindex="-1">readme</li><li role="treeitem" tabindex="-1">rules</li>';

    it("skips a closed folder, stops at the ends, and opens with the arrow", () => {
        const { document } = render("file-tree", { label: "Files" }, items);
        autoInit(document);
        const [src, app, readme, rules] = document.querySelectorAll("[role='treeitem']");
        on(src).press("ArrowDown");
        expect(document.activeElement).toBe(readme);
        on(readme).press("End");
        expect(document.activeElement).toBe(rules);
        on(rules).press("ArrowDown");
        expect(document.activeElement).toBe(rules);
        on(src).press("ArrowRight");
        expect(src.getAttribute("aria-expanded")).toBe("true");
        on(src).press("ArrowRight");
        expect(document.activeElement).toBe(app);
        on(app).press("ArrowLeft");
        expect(document.activeElement).toBe(src);
        on(src).press("ArrowLeft");
        expect(src.getAttribute("aria-expanded")).toBe("false");
    });

    it("types ahead, and * opens the folders at this level", () => {
        const { document } = render("file-tree", { label: "Files" }, items);
        autoInit(document);
        const [src, , readme] = document.querySelectorAll("[role='treeitem']");
        on(src).press("r");
        expect(document.activeElement).toBe(readme);
        on(readme).press("*");
        expect(src.getAttribute("aria-expanded")).toBe("true");
    });
});
