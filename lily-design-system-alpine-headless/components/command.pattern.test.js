// The shared command contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the command contract", async () => {
    await mount("command");
    const root = document.querySelector(".command");
    root.querySelector("input").setAttribute("aria-label", "Actions");
    root.querySelector('[role="listbox"]').setAttribute("aria-label", "Actions");
    const labels = ["Apple", "Banana", "Cherry"];
    root.querySelectorAll('[role="option"]').forEach((o, i) => (o.textContent = labels[i]));
    await runPattern("command", { root, hook: "command", settle: tick });
});
