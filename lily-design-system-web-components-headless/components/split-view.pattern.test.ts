import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { SplitView } from "./split-view.js";

if (!customElements.get("lily-split-view")) customElements.define("lily-split-view", SplitView);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the splitter contract", async () => {
    document.body.innerHTML = '<lily-split-view label="Panes"></lily-split-view>';
    await runPattern("splitter", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "split-view",
    });
});
