import { render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./ImageCropper";

test("meets the cropper contract", async () => {
    const { container } = render(() => <Subject label="Crop">{null}</Subject>);
    await runPattern("cropper", {
        root: container.querySelector<HTMLElement>(".image-cropper")!,
        hook: "image-cropper",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
