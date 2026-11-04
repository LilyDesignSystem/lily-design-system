import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TaskBar as Subject } from "./TaskBar";

test("meets the toolbar contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Actions");
    fixture.detectChanges();
    await runPattern("toolbar", {
        root: fixture.nativeElement.querySelector(".task-bar"),
        hook: "task-bar",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
