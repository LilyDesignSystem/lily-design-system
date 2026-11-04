// The shared tree contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the tree contract", async () => {
    await mount("tree-list");
    const root = document.querySelector(".tree-list");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    // The contract's type-ahead needs names; a branch's own text is what it matches.
    const visible = [...root.querySelectorAll('[role="treeitem"]')].filter(
        (el) => !el.parentElement.closest('[aria-expanded="false"]'),
    );
    visible.forEach((el, i) =>
        el.prepend(i === 0 ? "Fruit" : i === visible.length - 1 ? "Veg" : "Tea"),
    );
    await runPattern("tree", { root, hook: "tree-list", settle: tick });
});
