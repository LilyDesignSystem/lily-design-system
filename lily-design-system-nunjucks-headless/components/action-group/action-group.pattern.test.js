// @vitest-environment jsdom
// The shared action-group contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachToolbar } from "../widget-keys.js";

test("meets the action-group contract", async () => {
    document.body.innerHTML = render("action-group", { label: "Actions" }, "").document.body.innerHTML;
    const root = document.querySelector(".action-group");
    const detach = attachToolbar(root);
    await runPattern("action-group", { root, hook: "action-group" });
    detach();
});
