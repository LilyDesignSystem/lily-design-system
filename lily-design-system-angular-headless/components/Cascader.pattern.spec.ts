import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Cascader as Subject } from "./Cascader";

test("meets the tree-popup contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Choose");
    fixture.detectChanges();
    await runPattern("tree-popup", {
        root: fixture.nativeElement.querySelector(".cascader"),
        hook: "cascader",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
