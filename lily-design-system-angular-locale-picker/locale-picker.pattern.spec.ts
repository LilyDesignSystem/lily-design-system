import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { LocalePicker } from "./locale-picker.component";

test("meets the picker-listbox contract", async () => {
    const fixture = TestBed.createComponent(LocalePicker);
    fixture.componentRef.setInput("label", "Picker");
    fixture.componentRef.setInput("locales", ["de", "fr", "it"]);
    fixture.componentRef.setInput("value", "de");
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
            hook: "locale-picker",
            settle,
        });
    } finally {
        fixture.destroy();
    }
});
