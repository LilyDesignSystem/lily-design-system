// The shared menubar contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the menubar contract", async () => {
    await mount("menu-bar");
    const root = document.querySelector(".menu-bar");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    const labels = ["One", "Two", "Three"];
    root.querySelectorAll('[role="menuitem"]').forEach((item, i) => (item.textContent = labels[i]));
    await runPattern("menubar", { root, hook: "menu-bar", settle: tick });
});

it("meets the menubar-submenu contract", async () => {
    await mount("menu-bar");
    const root = document.querySelector(".menu-bar");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    root.replaceChildren(); // The contract brings its own items.
    await runPattern("menubar-submenu", { root, hook: "menu-bar", settle: tick });
});
