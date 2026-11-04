// @vitest-environment jsdom
// The shared cropper contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachCropper } from "../widget-keys.js";

test("meets the cropper contract", async () => {
    document.body.innerHTML = render("image-cropper", { label: "Crop" }, "").document.body.innerHTML;
    const root = document.querySelector(".image-cropper");
    const detach = attachCropper(root);
    await runPattern("cropper", { root, hook: "image-cropper" });
    detach();
});
