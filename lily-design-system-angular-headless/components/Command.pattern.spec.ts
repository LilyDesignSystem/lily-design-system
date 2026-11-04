import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Command as Subject } from "./Command";

test("meets the command contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Actions");
    fixture.detectChanges();
    await runPattern("command", {
        root: fixture.nativeElement.querySelector(".command"),
        hook: "command",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
