// @vitest-environment jsdom
// The shared toolbar contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachToolbar } from "../widget-keys.js";

test("meets the toolbar contract", async () => {
    document.body.innerHTML = render(
        "action-bar",
        { label: "Actions" },
        "",
    ).document.body.innerHTML;
    const root = document.querySelector(".action-bar");
    const detach = attachToolbar(root, { dismiss: ".action-bar-clear" });
    await runPattern("toolbar", { root, hook: "action-bar" });
    detach();
});
