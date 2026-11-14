import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { ProblemRecordList } from "./ProblemRecordList";

@Component({
    standalone: true,
    imports: [ProblemRecordList],
    template: `<lily-problem-record-list [status]="status()" [statusLabel]="statusLabel()"><li class="problem-record-list-item">One record</li></lily-problem-record-list>`,
})
class Host {
    readonly status = input<string>("known");
    readonly statusLabel = input<string>("Problems");
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
    return fixture.nativeElement.querySelector("ul.problem-record-list") as HTMLElement;
}

describe("ProblemRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        const list = mount("known", "Problems");
        expect(list.getAttribute("aria-label")).toBe("Problems");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".problem-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known problems (none-known)"],
        ["not-recorded", "No known problems (not-recorded)"],
        ["unavailable", "No known problems (unavailable)"],
        ["omitted", "No known problems (omitted)"],
    ])("status %s shows its words as an item, never blank", (status, words) => {
        const list = mount(status, words);
        const status_ = list.querySelector(".problem-record-list-status");
        expect(status_?.textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount("", "Problems");
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProblemRecordList has no status"),
            ),
        ).toBe(true);
    });
});
