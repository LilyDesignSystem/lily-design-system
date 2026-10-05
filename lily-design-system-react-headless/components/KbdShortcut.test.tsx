import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import Subject from "./KbdShortcut";

function root(container: HTMLElement) {
    return container.firstElementChild as HTMLElement;
}

describe("KbdShortcut", () => {
    test("root is a <kbd> with the kbd-shortcut class", () => {
        const { container } = render(<Subject keys={["Ctrl", "K"]} />);
        expect(root(container).tagName).toBe("KBD");
        expect(root(container).getAttribute("class")).toContain("kbd-shortcut");
    });

    test("renders one inner <kbd class=kbd-shortcut-key> per key, in order", () => {
        const { container } = render(<Subject keys={["Ctrl", "Shift", "P"]} />);
        const keys = Array.from(container.querySelectorAll("kbd.kbd-shortcut-key"));
        expect(keys.map((k) => k.textContent)).toEqual(["Ctrl", "Shift", "P"]);
    });

    test("separators go between keys only, default +", () => {
        const { container } = render(<Subject keys={["Ctrl", "Shift", "P"]} />);
        const seps = Array.from(container.querySelectorAll(".kbd-shortcut-separator"));
        expect(seps).toHaveLength(2);
        expect(seps.every((s) => s.textContent === "+")).toBe(true);
    });

    test("separator is configurable", () => {
        const { container } = render(<Subject keys={["G", "H"]} separator=" then " />);
        expect(container.querySelector(".kbd-shortcut-separator")!.textContent).toBe(" then ");
    });

    test("separators are aria-hidden", () => {
        const { container } = render(<Subject keys={["A", "B"]} />);
        expect(container.querySelector(".kbd-shortcut-separator")!.getAttribute("aria-hidden")).toBe("true");
    });

    test("single key renders no separator", () => {
        const { container } = render(<Subject keys={["Esc"]} />);
        expect(container.querySelector(".kbd-shortcut-separator")).toBeNull();
    });

    test("label becomes aria-label; absent otherwise", () => {
        const a = render(<Subject keys={["Ctrl", "K"]} label="Control K" />);
        expect(root(a.container).getAttribute("aria-label")).toBe("Control K");
        a.unmount();
        const b = render(<Subject keys={["Ctrl", "K"]} />);
        expect(root(b.container).getAttribute("aria-label")).toBeNull();
    });

    test("passes through attributes", () => {
        const { container } = render(<Subject keys={["A"]} data-testid="ks" />);
        expect(root(container).getAttribute("data-testid")).toBe("ks");
    });
});
