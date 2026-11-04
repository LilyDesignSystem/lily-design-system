// The shared tabs contract against TabBar.razor.js. Run as tests/js/tab-bar.test.mjs is.
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
const { attach } = await import("../../src/LilyBlazorHeadless/Components/TabBar.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the tabs contract", async () => {
    document.body.innerHTML = `<div class="tab-bar" role="tablist" aria-label="Sections"></div>`;
    const root = document.body.firstElementChild;
    const handle = attach(root);
    await runPattern("tabs", { root, hook: "tab-bar" });
    handle.dispose?.();
});
