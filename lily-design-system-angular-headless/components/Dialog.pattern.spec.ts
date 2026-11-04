import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Dialog as Subject } from "./Dialog";

test("meets the dialog contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Settings");
    fixture.detectChanges();
    const settle = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
    };
    await runPattern("dialog", {
        root: fixture.nativeElement,
        hook: "dialog",
        settle,
        open: async () => {
            fixture.componentRef.setInput("open", false);
            await settle();
            fixture.componentRef.setInput("open", true);
            await settle();
        },
    });
});
