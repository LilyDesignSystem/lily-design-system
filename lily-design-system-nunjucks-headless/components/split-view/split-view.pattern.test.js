// @vitest-environment jsdom
// The shared splitter contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachSplitView } from "../widget-keys.js";

test("meets the splitter contract", async () => {
    document.body.innerHTML = render("split-view", { label: "Panes" }).document.body.innerHTML;
    const root = document.querySelector(".split-view");
    const detach = attachSplitView(root);
    await runPattern("splitter", { root, hook: "split-view" });
    detach();
});
