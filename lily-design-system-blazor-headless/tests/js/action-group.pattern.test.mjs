// The shared action-group contract against ActionBar.razor.js, generated from shared/widget-keys.ts.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of ["window", "document", "HTMLElement", "Node", "KeyboardEvent", "Event"]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { attach } = await import("../../src/LilyBlazorHeadless/Components/ActionBar.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the action-group contract", async () => {
    document.body.innerHTML = `<div class="action-group" role="group" aria-label="Actions"></div>`;
    const root = document.body.firstElementChild;
    const handle = attach("toolbar", root);
    await runPattern("action-group", { root, hook: "action-group" });
    handle.dispose();
});
