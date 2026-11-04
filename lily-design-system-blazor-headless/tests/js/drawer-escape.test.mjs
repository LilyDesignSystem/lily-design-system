// Behaviour tests for the Escape guard in Drawer.razor.js, which every modal overlay opens through.
// Blazor's own listener is at the document, so a listener there stands in for the C# handler.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of ["window", "document", "HTMLElement", "Node", "KeyboardEvent"]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { open } = await import("../../src/LilyBlazorHeadless/Components/Drawer.razor.js");

function mount() {
    document.body.innerHTML = `<dialog><input></dialog>`;
    const dialog = document.querySelector("dialog");
    const input = dialog.querySelector("input");
    const handle = open(dialog, false);
    let reached = 0;
    const count = (event) => {
        if (event.key === "Escape") reached += 1;
    };
    document.addEventListener("keydown", count);
    const press = (prevented) => {
        const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
        if (prevented) input.addEventListener("keydown", (e) => e.preventDefault(), { once: true });
        input.dispatchEvent(event);
    };
    return { handle, press, reached: () => reached, stop: () => document.removeEventListener("keydown", count) };
}

test("an Escape handled inside the dialog does not reach Blazor", () => {
    const m = mount();
    m.press(true);
    assert.equal(m.reached(), 0);
    m.stop();
});

test("an unhandled Escape still reaches Blazor", () => {
    const m = mount();
    m.press(false);
    assert.equal(m.reached(), 1);
    m.stop();
});

test("closing removes the guard", () => {
    const m = mount();
    m.handle.close();
    m.press(true);
    assert.equal(m.reached(), 1);
    m.stop();
});
