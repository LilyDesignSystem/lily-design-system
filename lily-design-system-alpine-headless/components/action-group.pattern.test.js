// The shared action-group contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the action-group contract", async () => {
    await mount("action-group");
    const root = document.querySelector(".action-group");
    root.setAttribute("aria-label", "Actions");
    const labels = ["One", "Two", "Three"];
    root.querySelectorAll("[role='radio']").forEach((el, i) => (el.textContent = labels[i]));
    await runPattern("action-group", { root, hook: "action-group", settle: tick });
});
