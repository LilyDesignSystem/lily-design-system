// @vitest-environment jsdom
// The guards in widget-keys: composition, empty containers, missing parts, focus elsewhere, popover panels, and the
// Blazor attach dispatch. widget-keys.test.ts and the pattern contracts cover the keys themselves.
import { afterEach, expect, test, vi } from "vitest";

import {
    attach,
    attachGrid,
    attachMentions,
    attachRadioGroup,
    attachToolbar,
    attachTreePopup,
} from "./widget-keys";

function mount(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}
const press = (el: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(event);
    return event;
};

afterEach(() => {
    document.body.innerHTML = "";
});

const POPUP = (panelAttrs = "hidden") => `<div class="tree-select">
  <button class="tree-select-trigger" type="button" role="combobox" aria-expanded="false">Pick</button>
  <div class="tree-select-panel" ${panelAttrs}><ul role="tree"><li role="treeitem">Tea</li><li role="treeitem">Toast</li></ul></div>
</div>`;

test("a toolbar leaves a composing key, and an empty toolbar ignores keys", () => {
    const bar = mount('<div role="toolbar"><button>One</button><button>Two</button></div>');
    attachToolbar(bar);
    const one = bar.querySelector("button")!;
    one.focus();
    expect(press(one, "ArrowRight", { isComposing: true }).defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(one);

    const empty = mount('<div role="toolbar" tabindex="0"></div>');
    attachToolbar(empty);
    expect(press(empty, "ArrowRight").defaultPrevented).toBe(false);
});

test("a radio group leaves a composing key, and a key with focus off its radios", () => {
    const group = mount(
        '<div role="radiogroup" tabindex="-1"><div role="radio" tabindex="0">A</div><div role="radio">B</div></div>',
    );
    attachRadioGroup(group);
    const a = group.querySelector<HTMLElement>('[role="radio"]')!;
    a.focus();
    expect(press(a, "ArrowDown", { isComposing: true }).defaultPrevented).toBe(false);
    expect(a.getAttribute("aria-checked")).toBeNull();
    group.focus();
    expect(press(group, "ArrowDown").defaultPrevented).toBe(false);
    expect(group.querySelector('[aria-checked="true"]')).toBeNull();
});

test("a tree popup with no trigger or no panel is left alone", () => {
    const noPanel = mount(
        '<div class="tree-select"><button class="tree-select-trigger">Pick</button></div>',
    );
    const detach = attachTreePopup(noPanel);
    expect(noPanel.querySelector("button")!.hasAttribute("aria-controls")).toBe(false);
    expect(() => detach()).not.toThrow();
});

test("a tree popup in a popover panel opens and closes it with the Popover API", () => {
    const root = mount(POPUP("popover"));
    const panel = root.querySelector<HTMLElement>(".tree-select-panel")!;
    const calls: string[] = [];
    // jsdom has no Popover API: stand in for it, with the hide refusing as a browser does for a closed popover.
    Object.assign(panel, {
        showPopover: () => {
            calls.push("show");
            panel.style.display = "block";
        },
        hidePopover: () => {
            calls.push("hide");
            panel.style.display = "";
            throw new Error("InvalidStateError");
        },
    });
    const onOpen = vi.fn();
    attachTreePopup(root, { onOpen });
    const trigger = root.querySelector("button")!;
    trigger.click();
    expect(calls).toEqual(["show"]);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    trigger.click();
    expect(calls).toEqual(["show", "hide"]);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(onOpen.mock.calls).toEqual([[true], [false]]);
});

test("a tree popup ignores a composing key, a key off any item, and Escape when closed", () => {
    const root = mount(POPUP());
    const onOpen = vi.fn();
    attachTreePopup(root, { onOpen });
    const trigger = root.querySelector("button")!;
    expect(press(root, "Escape").defaultPrevented).toBe(false);
    trigger.click();
    const tea = root.querySelector<HTMLElement>('[role="treeitem"]')!;
    expect(document.activeElement).toBe(tea);
    expect(press(tea, "t", { isComposing: true }).defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(tea);
    const tree = root.querySelector('[role="tree"]')!;
    expect(press(tree, "ArrowDown").defaultPrevented).toBe(false);
    // ArrowLeft on a top-level leaf has nowhere to go.
    expect(press(tea, "ArrowLeft").defaultPrevented).toBe(false);
    expect(onOpen.mock.calls).toEqual([[true]]);
});

test("a disabled tree popup trigger does not open on ArrowDown", () => {
    const root = mount(POPUP());
    attachTreePopup(root);
    const trigger = root.querySelector("button")!;
    trigger.disabled = true;
    expect(press(trigger, "ArrowDown").defaultPrevented).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
});

test("mentions with no input or no panel are left alone", () => {
    const root = mount('<div class="mentions-input"><input aria-controls="nowhere"></div>');
    const detach = attachMentions(root);
    const input = root.querySelector("input")!;
    input.value = "@";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.hasAttribute("aria-expanded")).toBe(false);
    expect(() => detach()).not.toThrow();
});

test("mentions with nothing shown ignore the arrows, and a click without a mention writes nothing", () => {
    const root = mount(
        '<div class="mentions-input"><input role="combobox" aria-expanded="false" aria-controls="m"><div id="m" hidden><div role="option" hidden>Ann</div></div></div>',
    );
    const onSelect = vi.fn();
    attachMentions(root, { onSelect });
    const input = root.querySelector("input")!;
    input.value = "@";
    input.setSelectionRange(1, 1);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(press(input, "ArrowDown").defaultPrevented).toBe(false);
    // The text no longer holds a mention, so choosing an option has nothing to replace.
    input.value = "plain";
    input.setSelectionRange(5, 5);
    root.querySelector<HTMLElement>('[role="option"]')!.click();
    expect(input.value).toBe("plain");
    expect(onSelect).not.toHaveBeenCalled();
});

test("a grid ignores a key outside its cells, a cell outside its rows, and other keys", () => {
    const root = mount(`<table role="grid"><tbody>
        <tr><td tabindex="0">A</td><td tabindex="-1">B</td></tr>
    </tbody><caption><span role="gridcell" tabindex="-1" id="loose">Loose</span></caption></table>`);
    attachGrid(root);
    expect(press(root, "ArrowRight").defaultPrevented).toBe(false);
    const loose = document.getElementById("loose")!;
    loose.focus();
    expect(press(loose, "ArrowRight").defaultPrevented).toBe(false);
    const a = root.querySelector("td")!;
    a.focus();
    expect(press(a, "x").defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(a);
});

test("Blazor's attach dispatches by kind and reports each change to .NET", async () => {
    const calls: unknown[][] = [];
    const dotnet = {
        invokeMethodAsync: async (name: string, ...args: unknown[]) => {
            calls.push([name, ...args]);
        },
    };

    const splitter = mount(
        '<div role="separator" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>',
    );
    const split = attach("splitter", splitter, null, dotnet);
    press(splitter, "ArrowRight");
    expect(calls).toContainEqual(["OnKeyedChange", 51]);
    split.dispose();

    const cropper = mount(
        '<div tabindex="0" aria-label="Crop" data-crop-x="0" data-crop-y="0" data-crop-width="10" data-crop-height="10"></div>',
    );
    const crop = attach("cropper", cropper, undefined, dotnet);
    press(cropper, "ArrowRight");
    expect(calls.some(([name, value]) => name === "OnKeyedCrop" && typeof value === "object")).toBe(
        true,
    );
    crop.dispose();

    const popup = mount(POPUP());
    attach("tree-popup", popup, {}, dotnet);
    popup.querySelector("button")!.click();
    expect(calls).toContainEqual(["OnKeyedOpen", true]);
    press(popup.querySelector('[role="treeitem"]')!, "Enter");
    expect(calls).toContainEqual(["OnKeyedSelect", "Tea", ["Tea"], ["Tea"]]);

    const mentions = mount(
        '<div class="mentions-input"><input role="combobox" aria-expanded="false" aria-controls="m"><div id="m" hidden><div role="option">Ann</div></div></div>',
    );
    attach("mentions", mentions, null, dotnet);
    const input = mentions.querySelector("input")!;
    input.value = "@";
    input.setSelectionRange(1, 1);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    mentions.querySelector<HTMLElement>('[role="option"]')!.click();
    expect(calls).toContainEqual(["OnKeyedSelect", "Ann", ["Ann"], ["Ann"]]);

    // Without a .NET host the changes go nowhere, quietly.
    const quiet = mount(
        '<div role="separator" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>',
    );
    attach("splitter", quiet);
    expect(() => press(quiet, "ArrowRight")).not.toThrow();
});

test("Escape on the trigger closes an open tree popup and keeps focus there", () => {
    const root = mount(POPUP());
    attachTreePopup(root);
    const trigger = root.querySelector("button")!;
    trigger.click();
    trigger.focus();
    expect(press(trigger, "Escape").defaultPrevented).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
});

test("pressing a mention option does not take focus from the input", () => {
    const root = mount(
        '<div class="mentions-input"><input role="combobox" aria-expanded="false" aria-controls="m"><div id="m" hidden><div role="option">Ann</div></div></div>',
    );
    attachMentions(root);
    const down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    root.querySelector('[role="option"]')!.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
});
