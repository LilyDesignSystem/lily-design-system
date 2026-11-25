// A record list never says "none known" beside an entry (HC-C17, tasks.md P50-T2), in all seven lists.
import { afterEach, describe, expect, test } from "vitest";

import { AllergyRecordList } from "./allergy-record-list.js";
import { AllergyRecordListItem } from "./allergy-record-list-item.js";
import { DeviceRecordList } from "./device-record-list.js";
import { ImmunizationRecordList } from "./immunization-record-list.js";
import { MedicationRecordList } from "./medication-record-list.js";
import { ProblemRecordList } from "./problem-record-list.js";
import { ProcedureRecordList } from "./procedure-record-list.js";
import { RecordList } from "./record-list.js";

const LISTS = [
    ["record-list", RecordList],
    ["allergy-record-list", AllergyRecordList],
    ["medication-record-list", MedicationRecordList],
    ["problem-record-list", ProblemRecordList],
    ["immunization-record-list", ImmunizationRecordList],
    ["procedure-record-list", ProcedureRecordList],
    ["device-record-list", DeviceRecordList],
] as const;
for (const [base, type] of LISTS)
    if (!customElements.get(`lily-${base}`)) customElements.define(`lily-${base}`, type);
if (!customElements.get("lily-allergy-record-list-item"))
    customElements.define("lily-allergy-record-list-item", AllergyRecordListItem);

const conflictLabel = "The record also says none are known. Check the source.";
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => document.body.replaceChildren());

describe.each(LISTS)("%s", (base) => {
    const show = async (items: string, conflict = `conflict-label="${conflictLabel}"`) => {
        document.body.innerHTML = `<lily-${base} status="none-known" status-label="No known allergies" ${conflict}>${items}</lily-${base}>`;
        await settle();
        const host = document.body.firstElementChild!;
        return { host, ul: host.querySelector(`ul.${base}`)! };
    };
    const status = (ul: Element) => ul.querySelector(`:scope > .${base}-status`)?.textContent;

    test("HC-C17: none known beside an entry shows the entry and the conflict, never none known", async () => {
        const { ul } = await show("<li>Penicillin</li>");
        expect(ul.textContent).toContain("Penicillin");
        expect(status(ul)).toBe(conflictLabel);
        expect(ul.getAttribute("aria-label")).toBe(conflictLabel);
        expect(ul.getAttribute("data-status")).toBe("conflict");
        expect(ul.outerHTML).not.toContain("No known");
    });

    test("HC-C17: with no words for it, none known goes and the entry stays", async () => {
        const { ul } = await show("<li>Penicillin</li>", "");
        expect(ul.textContent).toContain("Penicillin");
        expect(ul.outerHTML).not.toContain("No known");
        expect(ul.hasAttribute("aria-label")).toBe(false);
    });

    test("no entry, or only a withdrawn one, is none known as before", async () => {
        for (const items of ["", '<li data-verification-status="refuted">Latex</li>']) {
            const { ul } = await show(items);
            expect(status(ul)).toBe("No known allergies");
            expect(ul.getAttribute("data-status")).toBe("none-known");
        }
    });

    test("HC-C17: the conflict comes and goes with the status, and with the entry", async () => {
        const { host, ul } = await show("");
        const li = document.createElement("li");
        li.textContent = "Penicillin";
        ul.append(li);
        await settle();
        expect(status(ul)).toBe(conflictLabel);
        li.remove();
        await settle();
        expect(status(ul)).toBe("No known allergies");
        ul.append(li);
        host.setAttribute("status", "unavailable");
        host.setAttribute("status-label", "Unavailable");
        await settle();
        expect(status(ul)).toBe("Unavailable");
        expect(ul.getAttribute("data-status")).toBe("unavailable");
        host.setAttribute("status", "known");
        await settle();
        expect(status(ul)).toBeUndefined();
    });

    test("HC-C17: a list moved in the page still follows its entries", async () => {
        const { host, ul } = await show("");
        const elsewhere = document.createElement("div");
        document.body.append(elsewhere);
        elsewhere.append(host);
        await settle();
        ul.append(Object.assign(document.createElement("li"), { textContent: "Penicillin" }));
        await settle();
        expect(status(ul)).toBe(conflictLabel);
    });
});

test("HC-C17: a Lily item counts, and a refuted one does not", async () => {
    const list = (verification: string) =>
        `<lily-allergy-record-list status="none-known" status-label="No known allergies" conflict-label="${conflictLabel}"><lily-allergy-record-list-item substance="Latex" verification-status="${verification}"></lily-allergy-record-list-item></lily-allergy-record-list>`;
    for (const [verification, words] of [
        ["confirmed", conflictLabel],
        ["refuted", "No known allergies"],
    ]) {
        document.body.innerHTML = list(verification);
        await settle();
        expect(document.querySelector(".allergy-record-list-status")?.textContent).toBe(words);
    }
});
