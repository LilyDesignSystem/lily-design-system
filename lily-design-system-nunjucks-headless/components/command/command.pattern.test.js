// @vitest-environment jsdom
// The shared command contract against the macro's markup and command.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { initCommand } from "./command.js";

test("meets the command contract", async () => {
    document.body.innerHTML = render("command", { id: "c", label: "Actions" }, "").document.body.innerHTML;
    const root = document.querySelector(".command");
    const detach = initCommand(root);
    await runPattern("command", { root, hook: "command" });
    detach();
});
