import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { ToolBar } from "./tool-bar.js";

if (!customElements.get("lily-tool-bar")) customElements.define("lily-tool-bar", ToolBar);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the toolbar contract", async () => {
    document.body.innerHTML = '<lily-tool-bar label="Tools"></lily-tool-bar>';
    await runPattern("toolbar", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "tool-bar",
    });
});
