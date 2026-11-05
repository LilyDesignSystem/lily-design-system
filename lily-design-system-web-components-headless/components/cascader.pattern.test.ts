import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Cascader } from "./cascader.js";

if (!customElements.get("lily-cascader")) customElements.define("lily-cascader", Cascader);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the tree-popup contract", async () => {
    document.body.innerHTML = '<lily-cascader label="Choose"></lily-cascader>';
    await runPattern("tree-popup", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "cascader",
    });
});
