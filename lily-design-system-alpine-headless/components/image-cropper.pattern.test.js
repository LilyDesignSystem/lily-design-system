// The shared cropper contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the cropper contract", async () => {
    await mount("image-cropper");
    const root = document.querySelector(".image-cropper");
    root.setAttribute("aria-label", "Crop");
    await runPattern("cropper", { root, hook: "image-cropper", settle: tick });
});
