// @vitest-environment jsdom
// The shared menu contract against the macro's markup and menu.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { initMenu } from "./menu.js";

test("meets the menu contract", async () => {
    document.body.innerHTML = render("menu", { label: "Sections" }, "").document.body.innerHTML;
    const root = document.querySelector(".menu");
    const handle = initMenu(root);
    await runPattern("menu", { root, hook: "menu" });
    handle.dispose();
});
