import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Drawer } from "./drawer.js";

if (!customElements.get("lily-drawer")) customElements.define("lily-drawer", Drawer);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the dialog contract", async () => {
    document.body.innerHTML = '<lily-drawer label="Settings"></lily-drawer>';
    const root = document.body.firstElementChild as HTMLElement;
    await runPattern("dialog", {
        root,
        hook: "drawer",
        open: () => root.setAttribute("open", ""),
    });
});
