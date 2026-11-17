import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { RecordListItem } from "./RecordListItem";

@Component({
    standalone: true,
    imports: [RecordListItem],
    template: `<ul><li lily-record-list-item status="final" statusLabel="Final" updated="2026-11-03" updatedLabel="Updated 3 Nov 2026"><span class="content">Blood pressure 128/82 mmHg</span></li><li lily-record-list-item></li></ul>`,
})
class Host {}

@Component({
    standalone: true,
    imports: [RecordListItem],
    template: `<ul><li lily-record-list-item status="final"></li></ul>`,
})
class Unlabelled {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

@Component({
    standalone: true,
    imports: [RecordListItem],
    template: `<ul><li lily-record-list-item entryState="withheld" entryStateLabel="Restricted">Blood pressure</li><li lily-record-list-item entryState="entered-in-error" entryStateLabel="Entered in error">Blood pressure</li></ul>`,
})
class EntryStates {}

describe("RecordListItem", () => {
    test("the host is the li, with each part and each status as text and data", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("record-list-item")).toBe(true);
        expect(full.getAttribute("data-status")).toBe("final");
        expect(full.querySelector(".record-list-item-status")?.textContent).toBe("Final");
        expect(full.querySelector("time.record-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
        expect(full.querySelector("time.record-list-item-updated")?.textContent).toBe(
            "Updated 3 Nov 2026",
        );
        expect(full.querySelector(".content")?.textContent).toBe("Blood pressure 128/82 mmHg");
        expect(bare.querySelector(".record-list-item-status")).toBeNull();
        expect(bare.querySelector(".record-list-item-updated")).toBeNull();
        expect(bare.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(Unlabelled).detectChanges();
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("RecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });

    test("withheld shows only the consumer's words; entered-in-error keeps the content struck through", () => {
        const fixture = TestBed.createComponent(EntryStates);
        fixture.detectChanges();
        const [withheld, inError] = Array.from(
            (fixture.nativeElement as HTMLElement).querySelectorAll("li.record-list-item"),
        );
        expect(withheld.getAttribute("data-entry-state")).toBe("withheld");
        expect(withheld.textContent).not.toContain("Blood pressure");
        expect(withheld.querySelector(".record-list-item-entry-state")?.textContent).toBe("Restricted");
        expect(inError.querySelector("del.record-list-item-entry")?.textContent).toBe("Blood pressure");
        expect(inError.querySelector(".record-list-item-entry-state")?.textContent).toBe("Entered in error");
    });
});
