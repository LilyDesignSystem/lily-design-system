import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { gridFixture, runPattern } from "../shared/pattern-tester";
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
