import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { MotionPicker } from "./motion-picker.component";

test("meets the picker-listbox contract", async () => {
    const fixture = TestBed.createComponent(MotionPicker);
    fixture.componentRef.setInput("label", "Picker");
    fixture.componentRef.setInput("motions", ["full", "none", "reduced"]);
    fixture.componentRef.setInput("value", "full");
    document.body.appendChild(fixture.nativeElement);
    const settle = async (): Promise<void> => {
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
    };
    await settle();
    try {
        await runPattern("picker-listbox", {
            root: fixture.nativeElement,
            hook: "motion-picker",
            settle,
        });
    } finally {
        fixture.destroy();
    }
});
