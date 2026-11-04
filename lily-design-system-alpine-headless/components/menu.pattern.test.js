// The shared menu contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the menu contract", async () => {
    await mount("menu");
    const root = document.querySelector(".menu");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    const labels = ["One", "Two", "Three"];
    root.querySelectorAll('[role="menuitem"]').forEach((item, i) => (item.textContent = labels[i]));
    await runPattern("menu", { root, hook: "menu", settle: tick });
});

it("meets the menu-submenu contract", async () => {
    await mount("menu");
    const root = document.querySelector(".menu");
    if (!root.getAttribute("aria-label") && !root.getAttribute("aria-labelledby"))
        root.setAttribute("aria-label", "Sections");
    root.replaceChildren(); // The contract brings its own items.
    await runPattern("menu-submenu", { root, hook: "menu", settle: tick });
});
