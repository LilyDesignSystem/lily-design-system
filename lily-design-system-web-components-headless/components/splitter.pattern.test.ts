import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Splitter } from "./splitter.js";

if (!customElements.get("lily-splitter")) customElements.define("lily-splitter", Splitter);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the splitter contract", async () => {
    document.body.innerHTML = '<lily-splitter label="Panes"></lily-splitter>';
    await runPattern("splitter", { root: document.body.firstElementChild as HTMLElement, hook: "splitter" });
});
