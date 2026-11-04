import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { MenuBar } from "./menu-bar.js";

if (!customElements.get("lily-menu-bar")) customElements.define("lily-menu-bar", MenuBar);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the menubar contract", async () => {
    document.body.innerHTML = '<lily-menu-bar label="Sections"></lily-menu-bar>';
    await runPattern("menubar", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "menu-bar",
    });
});
