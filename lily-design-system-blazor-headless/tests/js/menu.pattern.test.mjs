// The shared menu contract against Menu.razor.js. Run as tests/js/menu.test.mjs is.
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

test("meets the menu contract", async () => {
    document.body.innerHTML = `<div class="menu" role="menu" aria-label="Sections"></div>`;
    const root = document.body.firstElementChild;
    const handle = attach(root);
    await runPattern("menu", { root, hook: "menu" });
    handle.dispose?.();
});

test("meets the menu-submenu contract", async () => {
    document.body.innerHTML = `<div class="menu" role="menu" aria-label="Sections"></div>`;
    const root = document.body.firstElementChild;
    const handle = attach(root);
    await runPattern("menu-submenu", { root, hook: "menu" });
    handle.dispose?.();
});
