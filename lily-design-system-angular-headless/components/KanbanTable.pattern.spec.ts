import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { KanbanTable } from "./KanbanTable";

@Component({
    standalone: true,
    imports: [KanbanTable],
    template: `<lily-kanban-table label="Board"><tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody></lily-kanban-table>`,
})
class Host {}

test("meets the grid contract", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    await runPattern("grid", {
        root: fixture.nativeElement.querySelector(".kanban-table"),
        hook: "kanban-table",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
