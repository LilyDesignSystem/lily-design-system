import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import SettingsPicker, { nextSettingsPickerId } from "./SettingsPicker.svelte";

afterEach(() => cleanup());

const flush = () => new Promise((r) => setTimeout(r, 0));
const button = () => screen.getByRole("button", { name: "Settings" });
const panel = () => document.querySelector(".settings-picker-panel") as HTMLDivElement;

const content = createRawSnippet<[{ open: boolean; close: () => void }]>((args) => ({
    render: () =>
        `<div><a href="/a/">Alpha</a><button type="button" class="b">Beta</button>` +
        `<div data-settings-picker-keep-open><button type="button" class="keep">Keep</button></div>` +
        `<button type="button" class="closer">Closer</button></div>`,
    setup: (el: Element) => {
        el.querySelector(".closer")?.addEventListener("click", (e) => {
            e.stopPropagation();
            args().close();
        });
    },
}));

function mount(props: Record<string, unknown> = {}) {
    return render(SettingsPicker, { props: { label: "Settings", children: content, ...props } });
}

describe("SettingsPicker", () => {
    test("7.1 renders the root, button, tooltip and a hidden panel", () => {
        const { container } = mount();
        const root = container.querySelector("div.settings-picker") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.querySelector("button.settings-picker-button")).toBeTruthy();
        expect(root.querySelector(".settings-picker-tooltip")).toBeTruthy();
        expect(panel().hidden).toBe(true);
    });

    test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
        mount();
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(button().getAttribute("aria-controls")).toBe(panel().id);
    });

    test("7.3 the default icon is an aria-hidden svg; icon replaces it", () => {
        const { container } = mount();
        const svg = container.querySelector("svg.settings-picker-icon") as SVGElement;
        expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
        cleanup();
        const icon = createRawSnippet(() => ({ render: () => `<span class="mine">≡</span>` }));
        const again = mount({ icon });
        expect(again.container.querySelector(".mine")).toBeTruthy();
        expect(again.container.querySelector("svg.settings-picker-icon")).toBeNull();
    });

    test("7.4 the panel is a role=group named with label", () => {
        mount();
        expect(panel().getAttribute("role")).toBe("group");
        expect(panel().getAttribute("aria-label")).toBe("Settings");
    });

    test("7.5 the app's content renders inside; with none the panel is empty", () => {
        mount();
        expect(panel().querySelector("a")?.textContent).toBe("Alpha");
        cleanup();
        mount({ children: undefined });
        expect(panel().textContent?.trim()).toBe("");
    });

    test("7.6 click opens and leaves focus on the button", async () => {
        mount();
        button().focus();
        await fireEvent.click(button());
        await flush();
        expect(panel().hidden).toBe(false);
        expect(button().getAttribute("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(button());
    });

    test("7.7 a second click closes", async () => {
        mount();
        await fireEvent.click(button());
        await fireEvent.click(button());
        expect(panel().hidden).toBe(true);
    });

    test("7.8 ArrowDown opens at the first focusable, ArrowUp at the last", async () => {
        mount();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        await flush();
        expect(panel().hidden).toBe(false);
        expect(document.activeElement).toBe(panel().querySelector("a"));
        cleanup();
        mount();
        await fireEvent.keyDown(button(), { key: "ArrowUp" });
        await flush();
        expect(document.activeElement).toBe(panel().querySelector(".closer"));
    });

    test("7.9 Escape closes and returns focus to the button", async () => {
        mount();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        await flush();
        await fireEvent.keyDown(panel(), { key: "Escape" });
        await flush();
        expect(panel().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
    });

    test("7.10 Tab closes without sending focus to the document top", async () => {
        mount();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        await flush();
        await fireEvent.keyDown(panel(), { key: "Tab" });
        expect(panel().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
    });

    test("7.11 clicking outside closes", async () => {
        mount();
        await fireEvent.click(button());
        await fireEvent.click(document.body);
        expect(panel().hidden).toBe(true);
    });

    test("7.12 focus leaving the picker closes", async () => {
        mount();
        await fireEvent.click(button());
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        await fireEvent.focusOut(panel(), { relatedTarget: outside });
        expect(panel().hidden).toBe(true);
        outside.remove();
    });

    test("7.13 activating a link or button closes; keep-open and closeOnSelect=false do not", async () => {
        mount();
        await fireEvent.click(button());
        panel().querySelector("a")!.addEventListener("click", (e) => e.preventDefault());
        await fireEvent.click(panel().querySelector("a")!);
        await flush();
        expect(panel().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
        await fireEvent.click(button());
        await fireEvent.click(panel().querySelector(".b")!);
        expect(panel().hidden).toBe(true);
        await fireEvent.click(button());
        await fireEvent.click(panel().querySelector(".keep")!);
        expect(panel().hidden).toBe(false);
        cleanup();
        mount({ closeOnSelect: false });
        await fireEvent.click(button());
        await fireEvent.click(panel().querySelector(".b")!);
        expect(panel().hidden).toBe(false);
    });

    test("7.14 the content receives close()", async () => {
        mount({ closeOnSelect: false });
        await fireEvent.click(button());
        await fireEvent.click(panel().querySelector(".closer")!);
        expect(panel().hidden).toBe(true);
    });

    test("7.15 onOpenChange fires once per actual change", async () => {
        const onOpenChange = vi.fn();
        mount({ onOpenChange });
        await fireEvent.click(button());
        await fireEvent.click(button());
        await fireEvent.click(document.body);
        expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    });

    test("7.16 the tooltip is a hidden role=tooltip holding the label", () => {
        mount();
        const tip = document.querySelector(".settings-picker-tooltip") as HTMLElement;
        expect(tip.getAttribute("role")).toBe("tooltip");
        expect(tip.textContent).toBe("Settings");
        expect(tip.hidden).toBe(true);
    });

    test("7.17 the tooltip shows on hover, hides on Escape, and never shows while open", async () => {
        mount();
        const tip = document.querySelector(".settings-picker-tooltip") as HTMLElement;
        await fireEvent.mouseEnter(button());
        expect(tip.hidden).toBe(false);
        await fireEvent.keyDown(document, { key: "Escape" });
        expect(tip.hidden).toBe(true);
        await fireEvent.mouseLeave(button());
        await fireEvent.mouseEnter(button());
        expect(tip.hidden).toBe(false);
        await fireEvent.click(button());
        expect(tip.hidden).toBe(true);
    });

    test("7.18 the tooltip is not wired with aria-describedby", () => {
        mount();
        expect(button().hasAttribute("aria-describedby")).toBe(false);
    });

    test("7.19 class is appended and rest props are spread on the root", () => {
        const { container } = mount({ class: "extra", "data-x": "1" });
        const root = container.querySelector(".settings-picker") as HTMLElement;
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("data-x")).toBe("1");
    });

    test("7.20 two instances get distinct ids", () => {
        expect(nextSettingsPickerId()).not.toBe(nextSettingsPickerId());
    });

    test("7.21 the source ships no stylesheet, inline style or English default", () => {
        const src = readFileSync(resolve(__dirname, "SettingsPicker.svelte"), "utf8")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*\/\/.*$/gm, "");
        expect(src).not.toMatch(/<style|style=/);
        expect(src).not.toMatch(/(label|href):\s*["'`]/);
    });
});
