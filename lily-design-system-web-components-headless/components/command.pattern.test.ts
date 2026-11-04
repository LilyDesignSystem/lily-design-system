import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Command } from "./command.js";

if (!customElements.get("lily-command")) customElements.define("lily-command", Command);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the command contract", async () => {
    document.body.innerHTML = '<lily-command label="Actions"></lily-command>';
    const root = document.body.firstElementChild as HTMLElement;
    await runPattern("command", { root, hook: "command" });
});
