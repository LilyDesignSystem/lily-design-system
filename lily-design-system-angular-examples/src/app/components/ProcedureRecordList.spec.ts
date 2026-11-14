import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { ProcedureRecordList } from "./ProcedureRecordList";

@Component({
    standalone: true,
    imports: [ProcedureRecordList],
    template: `<lily-procedure-record-list [status]="status()" [statusLabel]="statusLabel()"><li class="procedure-record-list-item">One record</li></lily-procedure-record-list>`,
})
class Host {
    readonly status = input<string>("known");
    readonly statusLabel = input<string>("Procedures");
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

function mount(status: string, statusLabel: string) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput("status", status);
    fixture.componentRef.setInput("statusLabel", statusLabel);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector("ul.procedure-record-list") as HTMLElement;
}

describe("ProcedureRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        const list = mount("known", "Procedures");
        expect(list.getAttribute("aria-label")).toBe("Procedures");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".procedure-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known procedures (none-known)"],
        ["not-recorded", "No known procedures (not-recorded)"],
        ["unavailable", "No known procedures (unavailable)"],
        ["omitted", "No known procedures (omitted)"],
    ])("status %s shows its words as an item, never blank", (status, words) => {
        const list = mount(status, words);
        const status_ = list.querySelector(".procedure-record-list-status");
        expect(status_?.textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount("", "Procedures");
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProcedureRecordList has no status"),
            ),
        ).toBe(true);
    });
});
