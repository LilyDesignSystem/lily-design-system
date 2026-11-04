// The shared splitter contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the splitter contract", async () => {
    await mount("split-view");
    const root = document.querySelector(".split-view");
    await runPattern("splitter", { root, hook: "split-view", settle: tick });
});
