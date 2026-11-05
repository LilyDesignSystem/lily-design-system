// @vitest-environment jsdom
// The shared tree-popup contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachTreePopup } from "../widget-keys.js";

test("meets the tree-popup contract", async () => {
    document.body.innerHTML = render("cascader", {
        id: "c",
        label: "Choose",
    }).document.body.innerHTML;
    const root = document.querySelector(".cascader");
    const detach = attachTreePopup(root, { exclusive: true });
    await runPattern("tree-popup", { root, hook: "cascader" });
    detach();
});
