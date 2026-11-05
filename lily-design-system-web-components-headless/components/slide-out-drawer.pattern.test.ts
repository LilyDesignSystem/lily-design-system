import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { SlideOutDrawer } from "./slide-out-drawer.js";

if (!customElements.get("lily-slide-out-drawer"))
    customElements.define("lily-slide-out-drawer", SlideOutDrawer);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the dialog contract", async () => {
    document.body.innerHTML = '<lily-slide-out-drawer label="Settings"></lily-slide-out-drawer>';
    const root = document.body.firstElementChild as HTMLElement;
    await runPattern("dialog", {
        root,
        hook: "slide-out-drawer",
        open: () => root.setAttribute("open", ""),
    });
});
