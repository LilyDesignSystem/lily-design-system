// The shared splitter contract against ActionBar.razor.js, generated from shared/widget-keys.ts.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of [
    "window",
    "document",
    "HTMLElement",
    "Node",
    "KeyboardEvent",
    "Event",
    "CustomEvent",
]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { attach } = await import("../../src/LilyBlazorHeadless/Components/ActionBar.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the splitter contract", async () => {
    document.body.innerHTML = `<div class="root"><div role="separator" tabindex="0" aria-orientation="vertical" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div></div>`;
    const root = document.body.firstElementChild;
    const handle = attach("split-view", root);
    await runPattern("splitter", { root, hook: "split-view" });
    handle.dispose();
});
