// The shared radio-group contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the radio-group contract", async () => {
    await mount("segment-group");
    const root = document.querySelector(".segment-group");
    root.setAttribute("aria-label", "Actions");
    const labels = ["One", "Two", "Three"];
    root.querySelectorAll("[role='radio']").forEach((el, i) => (el.textContent = labels[i]));
    await runPattern("radio-group", { root, hook: "segment-group", settle: tick });
});
