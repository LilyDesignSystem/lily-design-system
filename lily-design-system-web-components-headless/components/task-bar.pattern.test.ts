import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TaskBar } from "./task-bar.js";

if (!customElements.get("lily-task-bar")) customElements.define("lily-task-bar", TaskBar);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the toolbar contract", async () => {
    document.body.innerHTML = '<lily-task-bar label="Actions"></lily-task-bar>';
    await runPattern("toolbar", { root: document.body.firstElementChild as HTMLElement, hook: "task-bar" });
});
