// The shared menubar contract against Menu.razor.js. Run as tests/js/menu-bar.test.mjs is.
import { test } from "node:test";
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
const { attach } = await import("../../src/LilyBlazorHeadless/Components/Menu.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the menubar contract", async () => {
    document.body.innerHTML = `<div class="menu-bar" role="menubar" aria-label="Sections"></div>`;
    const root = document.body.firstElementChild;
    const handle = attach(root, "horizontal");
    await runPattern("menubar", { root, hook: "menu-bar" });
    handle.dispose?.();
});

test("meets the menubar-submenu contract", async () => {
    document.body.innerHTML = `<div class="menu-bar" role="menubar" aria-label="Sections"></div>`;
    const root = document.body.firstElementChild;
    const handle = attach(root, "horizontal");
    await runPattern("menubar-submenu", { root, hook: "menu-bar" });
    handle.dispose?.();
});
