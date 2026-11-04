import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TreeList } from "./TreeList";

test("meets the tree contract", async () => {
    const fixture = TestBed.createComponent(TreeList);
    fixture.componentRef.setInput("label", "Sections");
    fixture.detectChanges();
    await runPattern("tree", {
        root: fixture.nativeElement.querySelector("[role='tree']") ?? fixture.nativeElement,
        hook: "tree-list",
    });
});
