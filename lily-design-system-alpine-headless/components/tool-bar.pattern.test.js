// The shared toolbar contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the toolbar contract", async () => {
    await mount("tool-bar");
    const root = document.querySelector(".tool-bar");
    root.setAttribute("aria-label", "Tools");
    const labels = ["One", "Two", "Three"];
    root.querySelectorAll("[role='radio']").forEach((el, i) => (el.textContent = labels[i]));
    await runPattern("toolbar", { root, hook: "tool-bar", settle: tick });
});
