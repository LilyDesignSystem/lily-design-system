import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { SharePicker } from "./share-picker.component";

test("meets the picker-disclosure contract", async () => {
    const fixture = TestBed.createComponent(SharePicker);
    fixture.componentRef.setInput("label", "Picker");
    fixture.componentRef.setInput("targets", [
        { id: "one", label: "One", href: () => "https://example.test/" },
    ]);
    fixture.componentRef.setInput("url", "https://example.test/");
    document.body.appendChild(fixture.nativeElement);
    const settle = async (): Promise<void> => {
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
    };
    await settle();
    try {
        await runPattern("picker-disclosure", {
            root: fixture.nativeElement,
            hook: "share-picker",
            settle,
        });
    } finally {
        fixture.destroy();
    }
});
