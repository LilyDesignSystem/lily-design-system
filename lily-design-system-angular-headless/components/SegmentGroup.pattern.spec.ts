import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { SegmentGroup as Subject } from "./SegmentGroup";

test("meets the radio-group contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Actions");
    fixture.detectChanges();
    await runPattern("radio-group", {
        root: fixture.nativeElement.querySelector(".segment-group"),
        hook: "segment-group",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
