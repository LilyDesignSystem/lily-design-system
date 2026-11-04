import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { ImageCropper as Subject } from "./ImageCropper";

test("meets the cropper contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Crop");
    fixture.detectChanges();
    await runPattern("cropper", {
        root: fixture.nativeElement.querySelector(".image-cropper"),
        hook: "image-cropper",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
