import * as React from "react";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import MenuPicker, { nextMenuPickerId, type ChildArgs } from "./MenuPicker";

afterEach(() => cleanup());

const button = () => screen.getByRole("button", { name: "Menu" });
const panel = () => document.querySelector(".menu-picker-panel") as HTMLDivElement;

const content = (args: ChildArgs) => (
    <div>
        <a href="/a/">Alpha</a>
        <button type="button" className="b">Beta</button>
        <div data-menu-picker-keep-open>
            <button type="button" className="keep">Keep</button>
        </div>
        <button
            type="button"
            className="closer"
            onClick={(e) => {
                e.stopPropagation();
                args.close();
            }}
        >
            Closer
        </button>
    </div>
);

function mount(props: Record<string, unknown> = {}) {
    return render(
        <MenuPicker label="Menu" {...(props as object)}>
            {(props.children as never) ?? content}
        </MenuPicker>,
    );
}

describe("MenuPicker", () => {
    test("7.1 renders the root, button, tooltip and a hidden panel", () => {
        const { container } = mount();
        const root = container.querySelector("div.menu-picker") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.querySelector("button.menu-picker-button")).toBeTruthy();
        expect(root.querySelector(".menu-picker-tooltip")).toBeTruthy();
        expect(panel().hidden).toBe(true);
    });

    test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
        mount();
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(button().getAttribute("aria-controls")).toBe(panel().id);
    });

    test("7.3 the default icon is an aria-hidden svg; icon replaces it", () => {
        const { container } = mount();
        const svg = container.querySelector("svg.menu-picker-icon") as SVGElement;
        expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
        cleanup();
        const again = render(
            <MenuPicker label="Menu" icon={() => <span className="mine">≡</span>} />,
        );
        expect(again.container.querySelector(".mine")).toBeTruthy();
        expect(again.container.querySelector("svg.menu-picker-icon")).toBeNull();
    });

    test("7.4 the panel is a role=group named with label", () => {
        mount();
        expect(panel().getAttribute("role")).toBe("group");
        expect(panel().getAttribute("aria-label")).toBe("Menu");
    });

    test("7.5 the app's content renders inside; with none the panel is empty", () => {
        mount();
        expect(panel().querySelector("a")?.textContent).toBe("Alpha");
        cleanup();
        render(<MenuPicker label="Menu" />);
        expect(panel().textContent?.trim()).toBe("");
    });

    test("7.6 click opens and leaves focus on the button", () => {
        mount();
        button().focus();
        fireEvent.click(button());
        expect(panel().hidden).toBe(false);
        expect(button().getAttribute("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(button());
    });

    test("7.7 a second click closes", () => {
        mount();
        fireEvent.click(button());
        fireEvent.click(button());
        expect(panel().hidden).toBe(true);
    });

    test("7.8 ArrowDown opens at the first focusable, ArrowUp at the last", () => {
        mount();
        fireEvent.keyDown(button(), { key: "ArrowDown" });
        expect(panel().hidden).toBe(false);
        expect(document.activeElement).toBe(panel().querySelector("a"));
        cleanup();
        mount();
        fireEvent.keyDown(button(), { key: "ArrowUp" });
        expect(document.activeElement).toBe(panel().querySelector(".closer"));
    });

    test("7.9 Escape closes and returns focus to the button", () => {
        mount();
        fireEvent.keyDown(button(), { key: "ArrowDown" });
        fireEvent.keyDown(panel(), { key: "Escape" });
        expect(panel().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
    });

    test("7.10 Tab closes without sending focus to the document top", () => {
        mount();
        fireEvent.keyDown(button(), { key: "ArrowDown" });
        fireEvent.keyDown(panel(), { key: "Tab" });
        expect(panel().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
    });

    test("7.11 clicking outside closes", () => {
        mount();
        fireEvent.click(button());
        fireEvent.click(document.body);
        expect(panel().hidden).toBe(true);
    });

    test("7.12 focus leaving the picker closes", () => {
        mount();
        fireEvent.click(button());
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        fireEvent.blur(panel().querySelector("a")!, { relatedTarget: outside });
        expect(panel().hidden).toBe(true);
        outside.remove();
    });

    test("7.13 activating a link or button closes; keep-open and closeOnSelect=false do not", () => {
        mount();
        fireEvent.click(button());
        panel().querySelector("a")!.addEventListener("click", (e) => e.preventDefault());
        fireEvent.click(panel().querySelector("a")!);
        expect(panel().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
        fireEvent.click(button());
        fireEvent.click(panel().querySelector(".b")!);
        expect(panel().hidden).toBe(true);
        fireEvent.click(button());
        fireEvent.click(panel().querySelector(".keep")!);
        expect(panel().hidden).toBe(false);
        cleanup();
        mount({ closeOnSelect: false });
        fireEvent.click(button());
        fireEvent.click(panel().querySelector(".b")!);
        expect(panel().hidden).toBe(false);
    });

    test("7.14 the content receives close()", () => {
        mount({ closeOnSelect: false });
        fireEvent.click(button());
        fireEvent.click(panel().querySelector(".closer")!);
        expect(panel().hidden).toBe(true);
    });

    test("7.15 onOpenChange fires once per actual change; open is controllable", () => {
        const onOpenChange = vi.fn();
        mount({ onOpenChange });
        fireEvent.click(button());
        fireEvent.click(button());
        fireEvent.click(document.body);
        expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
        cleanup();
        const { rerender } = render(<MenuPicker label="Menu" open={true}>x</MenuPicker>);
        expect(panel().hidden).toBe(false);
        rerender(<MenuPicker label="Menu" open={false}>x</MenuPicker>);
        expect(panel().hidden).toBe(true);
    });

    test("7.16 the tooltip is a hidden role=tooltip holding the label", () => {
        mount();
        const tip = document.querySelector(".menu-picker-tooltip") as HTMLElement;
        expect(tip.getAttribute("role")).toBe("tooltip");
        expect(tip.textContent).toBe("Menu");
        expect(tip.hidden).toBe(true);
    });

    test("7.17 the tooltip shows on hover, hides on Escape, and never shows while open", () => {
        mount();
        const tip = document.querySelector(".menu-picker-tooltip") as HTMLElement;
        fireEvent.mouseEnter(button());
        expect(tip.hidden).toBe(false);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(tip.hidden).toBe(true);
        fireEvent.mouseLeave(button());
        fireEvent.mouseEnter(button());
        expect(tip.hidden).toBe(false);
        fireEvent.click(button());
        expect(tip.hidden).toBe(true);
    });

    test("7.18 the tooltip is not wired with aria-describedby", () => {
        mount();
        expect(button().hasAttribute("aria-describedby")).toBe(false);
    });

    test("7.19 className is appended and rest props are spread on the root", () => {
        const { container } = mount({ className: "extra", "data-x": "1" });
        const root = container.querySelector(".menu-picker") as HTMLElement;
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("data-x")).toBe("1");
    });

    test("7.20 two instances get distinct ids", () => {
        expect(nextMenuPickerId()).not.toBe(nextMenuPickerId());
        mount();
        mount();
        const ids = Array.from(document.querySelectorAll(".menu-picker-panel")).map((p) => p.id);
        expect(new Set(ids).size).toBe(2);
    });

    test("7.21 the source ships no stylesheet, inline style or English default", () => {
        const src = readFileSync(resolve(__dirname, "MenuPicker.tsx"), "utf8")
            .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*\/\/.*$/gm, "");
        expect(src).not.toMatch(/<style|style=\{/);
        expect(src).not.toMatch(/(label|href):\s*["'`]/);
    });
});
