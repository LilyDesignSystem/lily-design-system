// The shared tree-expand contract against TreeList.razor.js. `toggle` is what TreeListItem.razor handles; TreeListToggleTests proves that half.
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
const { attach } = await import("../../src/LilyBlazorHeadless/Components/TreeList.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the tree-expand contract", async () => {
    document.body.innerHTML = `<ol class="tree-list" role="tree" aria-label="Files"><li role="treeitem" tabindex="0" aria-expanded="true">Parent<ol role="group"><li id="branch" role="treeitem" tabindex="-1" aria-expanded="false">Branch<ol role="group"><li role="treeitem" tabindex="-1">Child</li></ol></li></ol></li></ol>`;
    const branch = document.getElementById("branch");
    branch.addEventListener("toggle", () =>
        branch.setAttribute(
            "aria-expanded",
            String(branch.getAttribute("aria-expanded") !== "true"),
        ),
    );
    const handle = attach(document.body.firstElementChild);
    await runPattern("tree-expand", { root: branch, hook: "tree-list" });
    handle.dispose?.();
});
