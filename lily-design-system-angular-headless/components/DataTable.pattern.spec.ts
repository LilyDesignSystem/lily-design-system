import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { DataTable } from "./DataTable";

@Component({
    standalone: true,
    imports: [DataTable],
    template: `<lily-data-table label="Grid"><tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody></lily-data-table>`,
})
class Host {}

test("meets the grid contract", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    await runPattern("grid", {
        root: fixture.nativeElement.querySelector(".data-table"),
        hook: "data-table",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
