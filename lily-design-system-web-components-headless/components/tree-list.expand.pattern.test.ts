import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TreeList } from "./tree-list.js";

if (!customElements.get("lily-tree-list")) customElements.define("lily-tree-list", TreeList);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the tree-expand contract", async () => {
    document.body.innerHTML = `<lily-tree-list label="Files"><li role="treeitem" tabindex="0" aria-expanded="true">Parent<ol role="group"><li id="branch" role="treeitem" tabindex="-1" aria-expanded="false">Branch<ol role="group"><li role="treeitem" tabindex="-1">Child</li></ol></li></ol></li></lily-tree-list>`;
    await runPattern("tree-expand", {
        root: document.getElementById("branch") as HTMLElement,
        hook: "tree-list",
    });
});
