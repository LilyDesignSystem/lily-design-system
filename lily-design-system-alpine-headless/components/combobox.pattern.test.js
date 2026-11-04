// The shared combobox contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the combobox contract", async () => {
    await mount("combobox");
    const root = document.querySelector(".combobox");
    const input = root.querySelector("input");
    input.setAttribute("aria-label", "Fruit");
    const labels = ["Apple", "Banana", "Cherry"];
    root.querySelectorAll('[role="option"]').forEach((o, i) => (o.textContent = labels[i]));
    root.querySelector('[role="listbox"]').setAttribute("aria-label", "Fruit");
    await runPattern("combobox", {
        root,
        hook: "combobox",
        settle: tick,
        open: () => input.dispatchEvent(new Event("input", { bubbles: true })),
    });
});
