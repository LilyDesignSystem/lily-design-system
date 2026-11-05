import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { ActionBar } from "./action-bar.js";

if (!customElements.get("lily-action-bar")) customElements.define("lily-action-bar", ActionBar);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the toolbar contract", async () => {
    document.body.innerHTML = '<lily-action-bar label="Actions"></lily-action-bar>';
    await runPattern("toolbar", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "action-bar",
    });
});
