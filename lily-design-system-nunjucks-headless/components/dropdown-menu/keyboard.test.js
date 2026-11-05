// @vitest-environment jsdom
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../menu/menu.js";

const items =
    '<div role="menuitem" tabindex="-1">Open</div><div role="menuitem" tabindex="-1">Save</div><div role="menuitem" tabindex="-1">Close</div>';

function menu() {
    document.body.innerHTML = render("dropdown-menu", {
        label: "File",
        open: true,
        html: items,
    }).html;
    autoInit();
    const root = document.querySelector(".dropdown-menu");
    const all = [...root.querySelectorAll('[role="menuitem"]')];
    all[0].focus();
    return { root, all };
}

const press = (key) =>
    document.activeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
    );

describe("dropdown-menu keyboard", () => {
    test("is a named menu", () => {
        const { root } = menu();
        expect(root.getAttribute("role")).toBe("menu");
        expect(root.getAttribute("aria-label")).toBe("File");
    });

    test("arrows move through the items and wrap", () => {
        const { all } = menu();
        press("ArrowDown");
        expect(document.activeElement).toBe(all[1]);
        press("ArrowUp");
        press("ArrowUp");
        expect(document.activeElement).toBe(all[2]);
        press("ArrowDown");
        expect(document.activeElement).toBe(all[0]);
    });

    test("Home and End jump to the ends", () => {
        const { all } = menu();
        press("End");
        expect(document.activeElement).toBe(all[2]);
        press("Home");
        expect(document.activeElement).toBe(all[0]);
    });
});
