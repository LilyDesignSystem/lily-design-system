// The shared grid contract against ActionBar.razor.js, generated from shared/widget-keys.ts.
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

test("meets the grid contract", async () => {
    document.body.innerHTML = `<table class="gantt-table" role="grid" aria-label="Grid"><tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody></table>`;
    const root = document.body.firstElementChild;
    const handle = attach("grid", root);
    await runPattern("grid", { root, hook: "gantt-table" });
    handle.dispose();
});
