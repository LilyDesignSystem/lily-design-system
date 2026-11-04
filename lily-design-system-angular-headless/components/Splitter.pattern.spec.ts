import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Splitter as Subject } from "./Splitter";

test("meets the splitter contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Panes");
    fixture.detectChanges();
    await runPattern("splitter", {
        root: fixture.nativeElement.querySelector(".splitter"),
        hook: "splitter",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
