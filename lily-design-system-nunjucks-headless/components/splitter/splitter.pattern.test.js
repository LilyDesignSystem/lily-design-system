// @vitest-environment jsdom
// The shared splitter contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachSplitter } from "../widget-keys.js";

test("meets the splitter contract", async () => {
    document.body.innerHTML = render("splitter", { label: "Panes" }).document.body.innerHTML;
    const root = document.querySelector(".splitter");
    const detach = attachSplitter(root);
    await runPattern("splitter", { root, hook: "splitter" });
    detach();
});
