import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { TextSizePicker } from "./text-size-picker.component";

test("meets the picker-listbox contract", async () => {
    const fixture = TestBed.createComponent(TextSizePicker);
    fixture.componentRef.setInput("label", "Picker");
    fixture.componentRef.setInput("sizes", ["large", "normal", "small"]);
    fixture.componentRef.setInput("value", "large");
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
            hook: "text-size-picker",
            settle,
        });
    } finally {
        fixture.destroy();
    }
});
