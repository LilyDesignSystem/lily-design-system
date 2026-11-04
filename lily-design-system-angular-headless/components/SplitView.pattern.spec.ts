import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { SplitView as Subject } from "./SplitView";

test("meets the splitter contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Panes");
    fixture.detectChanges();
    await runPattern("splitter", {
        root: fixture.nativeElement.querySelector(".split-view"),
        hook: "split-view",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
