import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TreeList } from "./tree-list.js";

if (!customElements.get("lily-tree-list")) customElements.define("lily-tree-list", TreeList);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the tree contract", async () => {
    document.body.innerHTML = '<lily-tree-list label="Sections"></lily-tree-list>';
    await runPattern("tree", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "tree-list",
    });
});
