// The shared splitter contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the splitter contract", async () => {
    await mount("splitter");
    const root = document.querySelector(".splitter");
    await runPattern("splitter", { root, hook: "splitter", settle: tick });
});
