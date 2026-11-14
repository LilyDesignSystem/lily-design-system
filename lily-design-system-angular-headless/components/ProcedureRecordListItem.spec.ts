import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { ProcedureRecordListItem } from "./ProcedureRecordListItem";

@Component({
    standalone: true,
    imports: [ProcedureRecordListItem],
    template: `<ul><li lily-procedure-record-list-item procedure="Appendectomy" status="completed" statusLabel="Completed" performed="2018-04-22" performedLabel="22 Apr 2018"></li><li lily-procedure-record-list-item procedure="Appendectomy"></li></ul>`,
})
class Host {}

@Component({
    standalone: true,
    imports: [ProcedureRecordListItem],
    template: `<ul><li lily-procedure-record-list-item procedure="Appendectomy" status="completed"></li></ul>`,
})
class Unlabelled {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProcedureRecordListItem", () => {
    test("the host is the li, with each part and each status as text and data", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("procedure-record-list-item")).toBe(true);
        expect(full.getAttribute("data-status")).toBe("completed");
        expect(full.querySelector(".procedure-record-list-item-procedure")?.textContent).toBe(
            "Appendectomy",
        );
        expect(full.querySelector(".procedure-record-list-item-status")?.textContent).toBe(
            "Completed",
        );
        expect(
            full
                .querySelector("time.procedure-record-list-item-performed")
                ?.getAttribute("datetime"),
        ).toBe("2018-04-22");
        expect(full.querySelector("time.procedure-record-list-item-performed")?.textContent).toBe(
            "22 Apr 2018",
        );
        expect(bare.querySelector(".procedure-record-list-item-status")).toBeNull();
        expect(bare.querySelector(".procedure-record-list-item-performed")).toBeNull();
        expect(bare.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(Unlabelled).detectChanges();
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProcedureRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
