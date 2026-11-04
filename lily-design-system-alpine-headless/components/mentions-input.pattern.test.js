// The shared mentions contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the mentions contract", async () => {
    await mount("mentions-input");
    const root = document.querySelector(".mentions-input");
    root.querySelector("input").setAttribute("aria-label", "Choose");
    const labels = ["Apple", "Banana", "Cherry"];
    root.querySelectorAll('[role="option"]').forEach((o, i) => (o.textContent = labels[i]));
    await runPattern("mentions", { root, hook: "mentions-input", settle: tick });
});
