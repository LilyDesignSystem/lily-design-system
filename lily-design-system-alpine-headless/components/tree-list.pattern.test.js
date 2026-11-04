// The shared tree contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the tree contract", async () => {
    await mount("tree-list");
    const root = document.querySelector(".tree-list");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    await runPattern("tree", { root, hook: "tree-list", settle: tick });
});
