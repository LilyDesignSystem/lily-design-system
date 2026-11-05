// @vitest-environment jsdom
// The shared tree-popup contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachTreePopup } from "../widget-keys.js";

test("meets the tree-popup contract", async () => {
    document.body.innerHTML = render("tree-select", {
        id: "c",
        label: "Choose",
    }).document.body.innerHTML;
    const root = document.querySelector(".tree-select");
    const detach = attachTreePopup(root);
    await runPattern("tree-popup", { root, hook: "tree-select" });
    detach();
});
