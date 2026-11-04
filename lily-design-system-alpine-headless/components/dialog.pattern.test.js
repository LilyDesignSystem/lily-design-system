// The shared dialog contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the dialog contract", async () => {
    await mount("dialog");
    const root = document.body;
    root.querySelector("dialog").setAttribute("aria-label", "Settings");
    await runPattern("dialog", {
        root,
        hook: "dialog",
        settle: tick,
        open: () => root.querySelector(".dialog-trigger").click(),
    });
});
