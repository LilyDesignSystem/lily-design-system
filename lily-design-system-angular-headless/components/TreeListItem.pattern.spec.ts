import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { TreeListItem as Subject } from "./TreeListItem";

test("meets the tree-expand contract", async () => {
    const parent = document.createElement("li");
    parent.setAttribute("role", "treeitem");
    parent.tabIndex = -1;
    document.body.append(parent);
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Branch");
    fixture.componentRef.setInput("expanded", false);
    fixture.detectChanges();
    parent.append(fixture.nativeElement);
    await runPattern("tree-expand", {
        root: fixture.nativeElement.querySelector(".tree-list-item") ?? fixture.nativeElement,
        hook: "tree-list-item",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
