// A record list never says "none known" beside an entry (HC-C17, tasks.md P50-T2), in all seven lists.
import { act, cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, test, vi } from "vitest";

import RecordList from "./RecordList";
import AllergyRecordList from "./AllergyRecordList";
import MedicationRecordList from "./MedicationRecordList";
import ProblemRecordList from "./ProblemRecordList";
import ImmunizationRecordList from "./ImmunizationRecordList";
import ProcedureRecordList from "./ProcedureRecordList";
import DeviceRecordList from "./DeviceRecordList";
import { resetDevWarnings } from "./dev-warning";

const LISTS = [
    ["RecordList", "record-list", RecordList],
    ["AllergyRecordList", "allergy-record-list", AllergyRecordList],
    ["MedicationRecordList", "medication-record-list", MedicationRecordList],
    ["ProblemRecordList", "problem-record-list", ProblemRecordList],
    ["ImmunizationRecordList", "immunization-record-list", ImmunizationRecordList],
    ["ProcedureRecordList", "procedure-record-list", ProcedureRecordList],
    ["DeviceRecordList", "device-record-list", DeviceRecordList],
] as const;
const NONE = { status: "none-known", statusLabel: "No known allergies" } as const;
const conflictLabel = "The record also says none are known. Check the source.";

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe.each(LISTS)("%s", (name, base, List) => {
    const show = async (props: Record<string, unknown>, children?: React.ReactNode) => {
        const Subject = List as typeof RecordList;
        const view = render(React.createElement(Subject, props as never, children));
        const again = async (next: Record<string, unknown>, kids?: React.ReactNode) => {
            view.rerender(React.createElement(Subject, next as never, kids));
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 0));
            });
        };
        await again(props, children);
        return { root: view.container, ul: view.container.querySelector(`.${base}`)!, again };
    };

    test("HC-C17: none known beside an entry shows the entry and the conflict, never none known", async () => {
        const { ul, root } = await show({ ...NONE, conflictLabel }, <li>Penicillin</li>);
        expect(ul.textContent).toContain("Penicillin");
        expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe(conflictLabel);
        expect(ul.getAttribute("aria-label")).toBe(conflictLabel);
        expect(ul.getAttribute("data-status")).toBe("conflict");
        expect(root.innerHTML).not.toContain("No known");
    });

    test("HC-C17: with no words for it, none known goes, the entry stays, and development warns", async () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { ul, root } = await show({ ...NONE }, <li>Penicillin</li>);
        expect(ul.textContent).toContain("Penicillin");
        expect(root.innerHTML).not.toContain("No known");
        expect(
            spy.mock.calls.some((c) => String(c[0]).includes(`${name} has no conflictLabel`)),
        ).toBe(true);
    });

    test("no entry, or only a withdrawn one, is none known as before", async () => {
        for (const children of [
            undefined,
            <li
                key="r"
                data-verification-status="refuted"
            >
                Latex
            </li>,
        ]) {
            const { ul } = await show({ ...NONE, conflictLabel }, children);
            expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe(
                "No known allergies",
            );
            expect(ul.getAttribute("data-status")).toBe("none-known");
            cleanup();
        }
    });

    test("HC-C17: the conflict comes and goes with the status, and with the entry", async () => {
        const { ul, again } = await show(
            { status: "known", statusLabel: "Known", conflictLabel },
            <li>Penicillin</li>,
        );
        expect(ul.querySelector(`.${base}-status`)).toBeNull();
        await again({ ...NONE, conflictLabel }, <li>Penicillin</li>);
        expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe(conflictLabel);
        await again({ ...NONE, conflictLabel }, undefined);
        expect(ul.querySelector(`.${base}-status`)?.textContent?.trim()).toBe("No known allergies");
        await again(
            { status: "unavailable", statusLabel: "Unavailable", conflictLabel },
            <li>Penicillin</li>,
        );
        expect(ul.getAttribute("data-status")).toBe("unavailable");
    });
});
