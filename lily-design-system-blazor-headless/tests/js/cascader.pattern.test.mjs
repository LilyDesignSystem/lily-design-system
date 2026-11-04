// The shared tree-popup contract against ActionBar.razor.js, generated from shared/widget-keys.ts.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of ["window", "document", "Element", "HTMLElement", "Node", "KeyboardEvent", "MouseEvent", "Event", "CustomEvent"]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { attach } = await import("../../src/LilyBlazorHeadless/Components/ActionBar.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the tree-popup contract", async () => {
    document.body.innerHTML = `<div class="cascader" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-label="Choose"><button class="cascader-trigger" type="button"></button><div class="cascader-panel" hidden></div></div>`;
    const root = document.body.firstElementChild;
    const handle = attach("tree-popup", root);
    await runPattern("tree-popup", { root, hook: "cascader" });
    handle.dispose();
});
