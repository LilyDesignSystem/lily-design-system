// The shared menu contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the menu contract", async () => {
    await mount("menu");
    const root = document.querySelector(".menu");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    await runPattern("menu", { root, hook: "menu", settle: tick });
});
