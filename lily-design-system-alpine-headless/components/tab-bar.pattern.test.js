// The shared tabs contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the tabs contract", async () => {
    await mount("tab-bar");
    const root = document.querySelector(".tab-bar");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    await runPattern("tabs", { root, hook: "tab-bar", settle: tick });
});
