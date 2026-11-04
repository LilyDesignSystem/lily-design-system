// The shared tree contract against TreeList.razor.js. Run as tests/js/tree-list.test.mjs is.
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
const { attach } = await import("../../src/LilyBlazorHeadless/Components/TreeList.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the tree contract", async () => {
    document.body.innerHTML = `<ol class="tree-list" role="tree" aria-label="Sections"></ol>`;
    const root = document.body.firstElementChild;
    const handle = attach(root);
    await runPattern("tree", { root, hook: "tree-list" });
    handle.dispose?.();
});
