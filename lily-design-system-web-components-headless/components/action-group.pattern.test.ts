import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { ActionGroup } from "./action-group.js";

if (!customElements.get("lily-action-group"))
    customElements.define("lily-action-group", ActionGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the action-group contract", async () => {
    document.body.innerHTML = '<lily-action-group label="Actions"></lily-action-group>';
    await runPattern("action-group", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "action-group",
    });
});
