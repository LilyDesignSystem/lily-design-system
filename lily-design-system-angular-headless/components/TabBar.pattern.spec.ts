import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TabBar } from "./TabBar";

test("meets the tabs contract", async () => {
    const fixture = TestBed.createComponent(TabBar);
    fixture.componentRef.setInput("label", "Sections");
    fixture.detectChanges();
    await runPattern("tabs", {
        root: fixture.nativeElement.querySelector("[role='tablist']") ?? fixture.nativeElement,
        hook: "tab-bar",
    });
});
