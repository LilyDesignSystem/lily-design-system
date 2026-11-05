import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TreeSelect } from "./tree-select.js";

if (!customElements.get("lily-tree-select")) customElements.define("lily-tree-select", TreeSelect);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the tree-popup contract", async () => {
    document.body.innerHTML = '<lily-tree-select label="Choose"></lily-tree-select>';
    await runPattern("tree-popup", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "tree-select",
    });
});
