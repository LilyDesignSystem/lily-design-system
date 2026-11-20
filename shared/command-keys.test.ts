// @vitest-environment jsdom
// The command module's edges; the `command` contract (pattern-tester-direct.test.ts) covers its keys.
import { afterEach, expect, test } from "vitest";

import { attach, attachCommand } from "./command-keys";

afterEach(() => {
    document.body.innerHTML = "";
});

function mount(options = '<div role="option">Open</div><div role="option">Save</div>') {
    document.body.innerHTML = `<input type="search" aria-label="Actions"><div id="cl" role="listbox" aria-label="Actions">${options}</div>`;
    const input = document.querySelector("input")!;
    const list = document.getElementById("cl")!;
    const press = (key: string, init: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent("keydown", {
            key,
            bubbles: true,
            cancelable: true,
            ...init,
        });
        input.dispatchEvent(event);
        return event;
    };
    return { input, list, press };
}

test("a key during composition is the IME's", () => {
    const { input, list, press } = mount();
    attachCommand(input, list);
    expect(press("ArrowDown", { isComposing: true }).defaultPrevented).toBe(false);
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
});

test("with no usable option the keys are left alone", () => {
    const { input, list, press } = mount(
        '<div role="option" hidden>Gone</div><div role="option" aria-disabled="true">Off</div>',
    );
    attachCommand(input, list);
    expect(press("ArrowDown").defaultPrevented).toBe(false);
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
});

test("pressing an option does not take focus from the input", () => {
    const { input, list } = mount();
    attachCommand(input, list);
    const down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    list.firstElementChild!.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
});

test("typing drops the highlight", () => {
    const { input, list, press } = mount();
    attachCommand(input, list);
    press("ArrowDown");
    expect(input.getAttribute("aria-activedescendant")).toBe("cl-option-0");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    expect(list.querySelector('[aria-selected="true"]')).toBeNull();
});

test("attach wires the same behaviour and disposes it", () => {
    const { input, list, press } = mount();
    const handle = attach(input, list);
    expect(press("ArrowDown").defaultPrevented).toBe(true);
    handle.dispose();
    expect(press("ArrowDown").defaultPrevented).toBe(false);
    const down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    list.firstElementChild!.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(false);
});
