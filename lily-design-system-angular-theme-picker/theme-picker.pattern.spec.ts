import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { ThemePicker } from "./theme-picker.component";

test("meets the picker-listbox contract", async () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("label", "Picker");
    fixture.componentRef.setInput("themes", ["abyss", "dark", "light"]);
    fixture.componentRef.setInput("value", "abyss");
    fixture.componentRef.setInput("themesUrl", "/t/");
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
            hook: "theme-picker",
            settle,
        });
    } finally {
        fixture.destroy();
    }
});
