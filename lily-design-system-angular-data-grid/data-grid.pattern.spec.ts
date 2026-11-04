import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { gridActionsFixture, gridFixture, runPattern } from "../shared/pattern-tester";
import { DataGrid } from "./data-grid.component";

test("meets the grid contract", async () => {
    const fixture = TestBed.createComponent(DataGrid);
    fixture.componentRef.setInput("label", "People");
    fixture.componentRef.setInput("columns", gridFixture.columns);
    fixture.componentRef.setInput("rows", gridFixture.rows);
    fixture.detectChanges();
    await runPattern("grid", {
        root: fixture.nativeElement,
        hook: "data-grid",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});

test("meets the grid-actions contract", async () => {
    const fixture = TestBed.createComponent(DataGrid);
    fixture.componentRef.setInput("label", "People");
    fixture.componentRef.setInput("columns", gridActionsFixture.columns);
    fixture.componentRef.setInput("rows", gridActionsFixture.rows);
    fixture.componentRef.setInput("selectionMode", gridActionsFixture.selectionMode);
    fixture.detectChanges();
    await runPattern("grid-actions", {
        root: fixture.nativeElement,
        hook: "data-grid",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
