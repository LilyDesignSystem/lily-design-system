// The shared command contract against Command.razor.js, on the markup Command.razor renders.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of ["window", "document", "HTMLElement", "HTMLInputElement", "Node", "KeyboardEvent", "MouseEvent", "Event"]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { attach } = await import("../../src/LilyBlazorHeadless/Components/Command.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the command contract", async () => {
    document.body.innerHTML = `<div class="command" role="search" aria-label="Actions"><input type="search" aria-label="Actions" aria-controls="list"><div role="listbox" id="list" aria-label="Actions"></div></div>`;
    const root = document.body.firstElementChild;
    const handle = attach(root.querySelector("input"), root.querySelector("#list"));
    await runPattern("command", { root, hook: "command" });
    handle.dispose();
});
