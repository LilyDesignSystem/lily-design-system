// The shared toolbar contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the toolbar contract", async () => {
    await mount("task-bar");
    const root = document.querySelector(".task-bar");
    root.setAttribute("aria-label", "Actions");
    const labels = ["One", "Two", "Three"];
    root.querySelectorAll("[role='radio']").forEach((el, i) => (el.textContent = labels[i]));
    await runPattern("toolbar", { root, hook: "task-bar", settle: tick });
});
