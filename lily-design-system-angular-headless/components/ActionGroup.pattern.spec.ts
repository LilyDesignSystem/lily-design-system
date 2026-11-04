import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { ActionGroup as Subject } from "./ActionGroup";

test("meets the action-group contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Actions");
    fixture.detectChanges();
    await runPattern("action-group", {
        root: fixture.nativeElement.querySelector(".action-group"),
        hook: "action-group",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
