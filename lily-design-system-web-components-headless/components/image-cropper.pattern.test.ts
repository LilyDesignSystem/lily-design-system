import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { ImageCropper } from "./image-cropper.js";

if (!customElements.get("lily-image-cropper"))
    customElements.define("lily-image-cropper", ImageCropper);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the cropper contract", async () => {
    document.body.innerHTML = '<lily-image-cropper label="Crop"></lily-image-cropper>';
    await runPattern("cropper", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "image-cropper",
    });
});
