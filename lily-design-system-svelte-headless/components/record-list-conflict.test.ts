// A record list never says "none known" beside an entry (HC-C17, tasks.md P50-T2), in all seven lists.
import { render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import AllergyRecordList from "./AllergyRecordList/AllergyRecordList.svelte";
import DeviceRecordList from "./DeviceRecordList/DeviceRecordList.svelte";
import { resetDevWarnings } from "./dev-warning";
import ImmunizationRecordList from "./ImmunizationRecordList/ImmunizationRecordList.svelte";
import MedicationRecordList from "./MedicationRecordList/MedicationRecordList.svelte";
import ProblemRecordList from "./ProblemRecordList/ProblemRecordList.svelte";
import ProcedureRecordList from "./ProcedureRecordList/ProcedureRecordList.svelte";
import RecordList from "./RecordList/RecordList.svelte";

const LISTS = [
    ["RecordList", "record-list", RecordList],
    ["AllergyRecordList", "allergy-record-list", AllergyRecordList],
    ["MedicationRecordList", "medication-record-list", MedicationRecordList],
    ["ProblemRecordList", "problem-record-list", ProblemRecordList],
    ["ImmunizationRecordList", "immunization-record-list", ImmunizationRecordList],
    ["ProcedureRecordList", "procedure-record-list", ProcedureRecordList],
    ["DeviceRecordList", "device-record-list", DeviceRecordList],
] as const;
const items = (html: string) => createRawSnippet(() => ({ render: () => html }));
const ENTRY = items("<li>Penicillin</li>");
const NONE = { status: "none-known", statusLabel: "No known allergies" } as const;
const conflictLabel = "The record also says none are known. Check the source.";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe.each(LISTS)("%s", (name, base, List) => {
    const show = async (props: Record<string, unknown>) => {
        const view = render(List as typeof RecordList, { props: props as never });
        await tick();
        return { view, ul: view.container.querySelector(`.${base}`)! };
    };

    test("HC-C17: none known beside an entry shows the entry and the conflict, never none known", async () => {
        const { ul, view } = await show({ ...NONE, conflictLabel, children: ENTRY });
        expect(ul.textContent).toContain("Penicillin");
        expect(ul.querySelector(`.${base}-status`)?.textContent).toBe(conflictLabel);
        expect(ul.getAttribute("aria-label")).toBe(conflictLabel);
        expect(ul.getAttribute("data-status")).toBe("conflict");
        expect(view.container.innerHTML).not.toContain("No known");
    });

    test("HC-C17: with no words for it, none known goes, the entry stays, and development warns", async () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { ul, view } = await show({ ...NONE, children: ENTRY });
        expect(ul.textContent).toContain("Penicillin");
        expect(view.container.innerHTML).not.toContain("No known");
        expect(
            spy.mock.calls.some((c) => String(c[0]).includes(`${name} has no conflictLabel`)),
        ).toBe(true);
    });

    test("no entry, or only a withdrawn one, is none known as before", async () => {
        for (const children of [
            undefined,
            items('<li data-verification-status="refuted">Latex</li>'),
        ]) {
            const { ul } = await show({ ...NONE, conflictLabel, children });
            expect(ul.querySelector(`.${base}-status`)?.textContent).toBe("No known allergies");
            expect(ul.getAttribute("data-status")).toBe("none-known");
        }
    });

    test("HC-C17: the conflict comes and goes with the status, and with the entry", async () => {
        const { ul, view } = await show({
            status: "known",
            statusLabel: "Known",
            conflictLabel,
            children: ENTRY,
        });
        expect(ul.querySelector(`.${base}-status`)).toBeNull();
        await view.rerender({ ...NONE } as never);
        await tick();
        expect(ul.querySelector(`.${base}-status`)?.textContent).toBe(conflictLabel);
        ul.querySelector("li:last-child")!.remove();
        await new Promise((resolve) => setTimeout(resolve, 0));
        await tick();
        expect(ul.querySelector(`.${base}-status`)?.textContent).toBe("No known allergies");
        await view.rerender({ status: "unavailable", statusLabel: "Unavailable" } as never);
        expect(ul.getAttribute("data-status")).toBe("unavailable");
    });
});
