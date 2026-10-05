import { afterEach, describe, expect, test } from "vitest";

import { KbdShortcut } from "./kbd-shortcut.js";

if (!customElements.get("lily-kbd-shortcut")) {
    customElements.define("lily-kbd-shortcut", KbdShortcut);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const BASE = `<lily-kbd-shortcut keys='["Ctrl","K"]'></lily-kbd-shortcut>`;

describe("KbdShortcut", () => {
    test("root is a <kbd> with the kbd-shortcut class", () => {
        const kbd = render(BASE).querySelector(":scope > kbd")!;
        expect(kbd.className).toBe("kbd-shortcut");
    });

    test("renders one inner <kbd class=kbd-shortcut-key> per key, in order", () => {
        const keys = render(BASE).querySelectorAll("kbd.kbd-shortcut-key");
        expect(Array.from(keys).map((k) => k.textContent)).toEqual(["Ctrl", "K"]);
    });

    test("separators go between keys only, default +", () => {
        const seps = render(`<lily-kbd-shortcut keys='["Ctrl","Shift","P"]'></lily-kbd-shortcut>`).querySelectorAll(
            ".kbd-shortcut-separator",
        );
        expect(Array.from(seps).map((s) => s.textContent)).toEqual(["+", "+"]);
    });

    test("separator is configurable", () => {
        const sep = render(`<lily-kbd-shortcut keys='["g","h"]' separator="then"></lily-kbd-shortcut>`).querySelector(
            ".kbd-shortcut-separator",
        )!;
        expect(sep.textContent).toBe("then");
    });

    test("separators are aria-hidden", () => {
        const sep = render(BASE).querySelector(".kbd-shortcut-separator")!;
        expect(sep.getAttribute("aria-hidden")).toBe("true");
    });

    test("single key renders no separator", () => {
        const host = render(`<lily-kbd-shortcut keys='["Esc"]'></lily-kbd-shortcut>`);
        expect(host.querySelector(".kbd-shortcut-separator")).toBeNull();
    });

    test("comma-separated keys and the keys property both work", () => {
        const host = render(`<lily-kbd-shortcut keys="Alt,F4"></lily-kbd-shortcut>`) as unknown as KbdShortcut;
        expect(host.querySelectorAll(".kbd-shortcut-key").length).toBe(2);
        host.keys = ["A", "B", "C"];
        expect(host.querySelectorAll(".kbd-shortcut-key").length).toBe(3);
    });

    test("label becomes aria-label; absent otherwise", () => {
        const labelled = render(`<lily-kbd-shortcut keys='["Ctrl","K"]' label="Control K"></lily-kbd-shortcut>`);
        expect(labelled.querySelector(":scope > kbd")!.getAttribute("aria-label")).toBe("Control K");
        expect(render(BASE).querySelector(":scope > kbd")!.hasAttribute("aria-label")).toBe(false);
    });

    test("passes through attributes and consumer class", () => {
        const kbd = render(
            `<lily-kbd-shortcut keys='["A"]' data-testid="x" class="extra"></lily-kbd-shortcut>`,
        ).querySelector(":scope > kbd")!;
        expect(kbd.getAttribute("data-testid")).toBe("x");
        expect(kbd.className).toBe("kbd-shortcut extra");
    });
});
