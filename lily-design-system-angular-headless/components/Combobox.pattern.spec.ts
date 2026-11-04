import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Combobox as Subject } from "./Combobox";

test("meets the combobox contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Fruit");
    fixture.detectChanges();
    const settle = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
    };
    await runPattern("combobox", {
        root: fixture.nativeElement.querySelector(".combobox"),
        hook: "combobox",
        settle,
        open: async () => {
            fixture.componentRef.setInput("open", true);
            await settle();
        },
    });
});
