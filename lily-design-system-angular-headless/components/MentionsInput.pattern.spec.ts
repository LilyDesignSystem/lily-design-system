import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { MentionsInput as Subject } from "./MentionsInput";

test("meets the mentions contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Choose");
    fixture.detectChanges();
    await runPattern("mentions", {
        root: fixture.nativeElement.querySelector(".mentions-input"),
        hook: "mentions-input",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
