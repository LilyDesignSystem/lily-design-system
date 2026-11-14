import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { ProblemRecordListItem } from "./ProblemRecordListItem";

@Component({
    standalone: true,
    imports: [ProblemRecordListItem],
    template: `<ul><li lily-problem-record-list-item condition="Type 2 diabetes" clinicalStatus="active" clinicalStatusLabel="Active" verificationStatus="confirmed" verificationStatusLabel="Confirmed" severityLabel="Moderate" onset="2019-06-01" onsetLabel="Since June 2019" abatement="2024-01-15" abatementLabel="Resolved 15 Jan 2024"></li><li lily-problem-record-list-item condition="Type 2 diabetes"></li></ul>`,
})
class Host {}

@Component({
    standalone: true,
    imports: [ProblemRecordListItem],
    template: `<ul><li lily-problem-record-list-item condition="Type 2 diabetes" clinicalStatus="active"></li></ul>`,
})
class Unlabelled {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProblemRecordListItem", () => {
    test("the host is the li, with each part and each status as text and data", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("problem-record-list-item")).toBe(true);
        expect(full.getAttribute("data-clinical-status")).toBe("active");
        expect(full.getAttribute("data-verification-status")).toBe("confirmed");
        expect(full.querySelector(".problem-record-list-item-condition")?.textContent).toBe(
            "Type 2 diabetes",
        );
        expect(full.querySelector(".problem-record-list-item-clinical-status")?.textContent).toBe(
            "Active",
        );
        expect(
            full.querySelector(".problem-record-list-item-verification-status")?.textContent,
        ).toBe("Confirmed");
        expect(full.querySelector(".problem-record-list-item-severity")?.textContent).toBe(
            "Moderate",
        );
        expect(
            full.querySelector("time.problem-record-list-item-onset")?.getAttribute("datetime"),
        ).toBe("2019-06-01");
        expect(full.querySelector("time.problem-record-list-item-onset")?.textContent).toBe(
            "Since June 2019",
        );
        expect(
            full.querySelector("time.problem-record-list-item-abatement")?.getAttribute("datetime"),
        ).toBe("2024-01-15");
        expect(full.querySelector("time.problem-record-list-item-abatement")?.textContent).toBe(
            "Resolved 15 Jan 2024",
        );
        expect(bare.querySelector(".problem-record-list-item-clinical-status")).toBeNull();
        expect(bare.querySelector(".problem-record-list-item-verification-status")).toBeNull();
        expect(bare.querySelector(".problem-record-list-item-severity")).toBeNull();
        expect(bare.querySelector(".problem-record-list-item-onset")).toBeNull();
        expect(bare.querySelector(".problem-record-list-item-abatement")).toBeNull();
        expect(bare.hasAttribute("data-clinical-status")).toBe(false);
        expect(bare.hasAttribute("data-verification-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(Unlabelled).detectChanges();
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProblemRecordListItem has no clinicalStatusLabel"),
            ),
        ).toBe(true);
    });
});
