// @vitest-environment jsdom
// The shared menubar contract against the macro's markup and menu-bar.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { initMenuBar } from "./menu-bar.js";

test("meets the menubar contract", async () => {
    document.body.innerHTML = render("menu-bar", { label: "Sections" }, "").document.body.innerHTML;
    const root = document.querySelector(".menu-bar");
    const handle = initMenuBar(root);
    await runPattern("menubar", { root, hook: "menu-bar" });
    handle.dispose();
});
