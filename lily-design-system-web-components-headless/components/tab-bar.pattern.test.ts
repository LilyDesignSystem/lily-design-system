import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TabBar } from "./tab-bar.js";

if (!customElements.get("lily-tab-bar")) customElements.define("lily-tab-bar", TabBar);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the tabs contract", async () => {
    document.body.innerHTML = '<lily-tab-bar label="Sections"></lily-tab-bar>';
    await runPattern("tabs", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "tab-bar",
    });
});
