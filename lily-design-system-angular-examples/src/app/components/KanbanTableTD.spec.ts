import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { KanbanTableTD } from "./KanbanTableTD";

// KanbanTableTD is an attribute-selector component (`td[lily-kanban-table-td]`): its host is the
// native <td> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(KanbanTableTD)` directly (the
// latter has no <td> to attach to and falls back to a bare <div>).
@Component({
    standalone: true,
    imports: [KanbanTableTD],
    template: `<td lily-kanban-table-td [className]="className"></td>`,
})
class TestHost {
    className = "";
}

describe("KanbanTableTD", () => {
    test("the host is the td itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("td");
        expect(el.tagName).toBe("TD");
        expect(el.classList.contains("kanban-table-td")).toBe(true);
    });

    test("appends the className input to the host class list", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("td");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a gridcell out of the tab order", () => {
        const fixture = TestBed.createComponent(KanbanTableTD);
        fixture.detectChanges();
        const el = fixture.nativeElement;
        expect(el.getAttribute("role")).toBe("gridcell");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("is the tab stop when active", () => {
        const fixture = TestBed.createComponent(KanbanTableTD);
        fixture.componentRef.setInput("active", true);
        fixture.detectChanges();
        const el = fixture.nativeElement;
        expect(el.getAttribute("tabindex")).toBe("0");
    });
});

@Component({
    standalone: true,
    imports: [KanbanTableTD],
    template: `<table><tr><td lily-kanban-table-td [attr.tabindex]="'0'">x</td></tr></table>`,
})
class ConsumerHost {}

test("a consumer's own tabindex survives the cell", () => {
    const fixture = TestBed.createComponent(ConsumerHost);
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector("td");
    expect(cell.getAttribute("tabindex")).toBe("0");
});
