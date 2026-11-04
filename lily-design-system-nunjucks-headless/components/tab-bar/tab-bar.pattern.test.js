// @vitest-environment jsdom
// The shared tabs contract against the macro's markup and tab-bar.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { initTabBar } from "./tab-bar.js";

test("meets the tabs contract", async () => {
    document.body.innerHTML = render("tab-bar", { label: "Sections" }, "").document.body.innerHTML;
    const root = document.querySelector(".tab-bar");
    const handle = initTabBar(root);
    await runPattern("tabs", { root, hook: "tab-bar" });
    handle.dispose();
});
