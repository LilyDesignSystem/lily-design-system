import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./ImageCropper.vue";

test("meets the cropper contract", async () => {
    const { container } = render(Subject, { props: { label: "Crop" } });
    await runPattern("cropper", {
        root: container.querySelector<HTMLElement>(".image-cropper")!,
        hook: "image-cropper",
    });
});
