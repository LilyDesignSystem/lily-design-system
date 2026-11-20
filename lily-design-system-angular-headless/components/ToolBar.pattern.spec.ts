import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { ToolBar as Subject } from "./ToolBar";

test("meets the toolbar contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Tools");
    fixture.detectChanges();
    await runPattern("toolbar", {
        root: fixture.nativeElement.querySelector(".tool-bar"),
        hook: "tool-bar",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
