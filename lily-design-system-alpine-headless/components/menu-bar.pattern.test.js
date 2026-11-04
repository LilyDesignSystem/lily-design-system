// The shared menubar contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the menubar contract", async () => {
    await mount("menu-bar");
    const root = document.querySelector(".menu-bar");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    await runPattern("menubar", { root, hook: "menu-bar", settle: tick });
});
