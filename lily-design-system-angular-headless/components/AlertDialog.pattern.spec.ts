import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { AlertDialog as Subject } from "./AlertDialog";

test("meets the dialog contract, as an alert dialog", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("title", "Are you sure?");
    fixture.detectChanges();
    const settle = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
    };
    await runPattern("dialog", {
        root: fixture.nativeElement,
        hook: "alert-dialog",
        settle,
        open: async () => {
            fixture.componentRef.setInput("open", false);
            await settle();
            fixture.componentRef.setInput("open", true);
            await settle();
        },
    });
});
