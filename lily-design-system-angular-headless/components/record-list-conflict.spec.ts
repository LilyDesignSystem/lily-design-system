// A record list never says "none known" beside an entry (HC-C17, tasks.md P50-T2), in all seven lists.
import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { AllergyRecordList } from "./AllergyRecordList";
import { DeviceRecordList } from "./DeviceRecordList";
import { ImmunizationRecordList } from "./ImmunizationRecordList";
import { MedicationRecordList } from "./MedicationRecordList";
import { ProblemRecordList } from "./ProblemRecordList";
import { ProcedureRecordList } from "./ProcedureRecordList";
import { RecordList } from "./RecordList";

const given = signal({
    status: "none-known",
    statusLabel: "No known allergies",
    conflictLabel: "",
});
const item = signal<{ text: string; verification: string | null } | null>(null);

@Component({
    standalone: true,
    imports: [RecordList],
    template: `<lily-record-list [status]="$any(given().status)" [statusLabel]="given().statusLabel" [conflictLabel]="given().conflictLabel">@if (item(); as i) {<li [attr.data-verification-status]="i.verification">{{ i.text }}</li>}</lily-record-list>`,
})
class RecordListHost {
    readonly given = given;
    readonly item = item;
}

@Component({
    standalone: true,
    imports: [AllergyRecordList],
    template: `<lily-allergy-record-list [status]="$any(given().status)" [statusLabel]="given().statusLabel" [conflictLabel]="given().conflictLabel">@if (item(); as i) {<li [attr.data-verification-status]="i.verification">{{ i.text }}</li>}</lily-allergy-record-list>`,
})
class AllergyRecordListHost {
    readonly given = given;
    readonly item = item;
}

@Component({
    standalone: true,
    imports: [MedicationRecordList],
    template: `<lily-medication-record-list [status]="$any(given().status)" [statusLabel]="given().statusLabel" [conflictLabel]="given().conflictLabel">@if (item(); as i) {<li [attr.data-verification-status]="i.verification">{{ i.text }}</li>}</lily-medication-record-list>`,
})
class MedicationRecordListHost {
    readonly given = given;
    readonly item = item;
}

@Component({
    standalone: true,
    imports: [ProblemRecordList],
    template: `<lily-problem-record-list [status]="$any(given().status)" [statusLabel]="given().statusLabel" [conflictLabel]="given().conflictLabel">@if (item(); as i) {<li [attr.data-verification-status]="i.verification">{{ i.text }}</li>}</lily-problem-record-list>`,
})
class ProblemRecordListHost {
    readonly given = given;
    readonly item = item;
}

@Component({
    standalone: true,
    imports: [ImmunizationRecordList],
    template: `<lily-immunization-record-list [status]="$any(given().status)" [statusLabel]="given().statusLabel" [conflictLabel]="given().conflictLabel">@if (item(); as i) {<li [attr.data-verification-status]="i.verification">{{ i.text }}</li>}</lily-immunization-record-list>`,
})
class ImmunizationRecordListHost {
    readonly given = given;
    readonly item = item;
}

@Component({
    standalone: true,
    imports: [ProcedureRecordList],
    template: `<lily-procedure-record-list [status]="$any(given().status)" [statusLabel]="given().statusLabel" [conflictLabel]="given().conflictLabel">@if (item(); as i) {<li [attr.data-verification-status]="i.verification">{{ i.text }}</li>}</lily-procedure-record-list>`,
})
class ProcedureRecordListHost {
    readonly given = given;
    readonly item = item;
}

@Component({
    standalone: true,
    imports: [DeviceRecordList],
    template: `<lily-device-record-list [status]="$any(given().status)" [statusLabel]="given().statusLabel" [conflictLabel]="given().conflictLabel">@if (item(); as i) {<li [attr.data-verification-status]="i.verification">{{ i.text }}</li>}</lily-device-record-list>`,
})
class DeviceRecordListHost {
    readonly given = given;
    readonly item = item;
}

const LISTS = [
    ["RecordList", "record-list", RecordListHost],
    ["AllergyRecordList", "allergy-record-list", AllergyRecordListHost],
    ["MedicationRecordList", "medication-record-list", MedicationRecordListHost],
    ["ProblemRecordList", "problem-record-list", ProblemRecordListHost],
    ["ImmunizationRecordList", "immunization-record-list", ImmunizationRecordListHost],
    ["ProcedureRecordList", "procedure-record-list", ProcedureRecordListHost],
    ["DeviceRecordList", "device-record-list", DeviceRecordListHost],
] as const;
const ENTRY = { text: "Penicillin", verification: null };
const NONE = { status: "none-known", statusLabel: "No known allergies" };
const conflictLabel = "The record also says none are known. Check the source.";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe.each(LISTS)("%s", (name, base, Host) => {
    const show = async (
        next: typeof given extends () => infer T ? T : never,
        entry: typeof ENTRY | { text: string; verification: string } | null,
    ) => {
        given.set(next);
        item.set(entry);
        const fixture = TestBed.createComponent<unknown>(Host);
        const settle = async () => {
            fixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 0));
            fixture.detectChanges();
        };
        await settle();
        const root = fixture.nativeElement as HTMLElement;
        const again = async (n: typeof next, e: typeof entry) => {
            given.set(n);
            item.set(e);
            await settle();
        };
        return { root, ul: root.querySelector(`ul.${base}`)!, again };
    };

    test("HC-C17: none known beside an entry shows the entry and the conflict, never none known", async () => {
        const { ul, root } = await show({ ...NONE, conflictLabel }, ENTRY);
        expect(ul.textContent).toContain("Penicillin");
        expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe(conflictLabel);
        expect(ul.getAttribute("aria-label")).toBe(conflictLabel);
        expect(ul.getAttribute("data-status")).toBe("conflict");
        expect(root.innerHTML).not.toContain("No known");
    });

    test("HC-C17: with no words for it, none known goes, the entry stays, and development warns", async () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { ul, root } = await show({ ...NONE, conflictLabel: "" }, ENTRY);
        expect(ul.textContent).toContain("Penicillin");
        expect(root.innerHTML).not.toContain("No known");
        expect(
            spy.mock.calls.some((c) => String(c[0]).includes(`${name} has no conflictLabel`)),
        ).toBe(true);
    });

    test("no entry, or only a withdrawn one, is none known as before", async () => {
        for (const children of [null, { text: "Latex", verification: "refuted" }]) {
            const { ul } = await show({ ...NONE, conflictLabel }, children);
            expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe(
                "No known allergies",
            );
            expect(ul.getAttribute("data-status")).toBe("none-known");
        }
    });

    test("HC-C17: the conflict comes and goes with the status, and with the entry", async () => {
        const { ul, again } = await show(
            { status: "known", statusLabel: "Known", conflictLabel },
            ENTRY,
        );
        expect(ul.querySelector(`.${base}-status`)).toBeNull();
        await again({ ...NONE, conflictLabel }, ENTRY);
        expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe(conflictLabel);
        await again({ ...NONE, conflictLabel }, null);
        expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe("No known allergies");
        await again({ status: "unavailable", statusLabel: "Unavailable", conflictLabel }, ENTRY);
        expect(ul.getAttribute("data-status")).toBe("unavailable");
    });
});
