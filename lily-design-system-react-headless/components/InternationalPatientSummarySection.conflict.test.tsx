// An IPS section never prints "none known" above a record list that holds an entry (HC-C17, tasks.md P50-T29).
import { act, render } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import AllergyRecordList from "./AllergyRecordList";
import Section from "./InternationalPatientSummarySection";

const host = (entry: boolean) => (
    <Section
        section="allergies"
        heading="Allergies"
        status="none-known"
        statusLabel="No known allergies"
    >
        <AllergyRecordList
            status="none-known"
            statusLabel="No known allergies"
            conflictLabel="Check the source"
        >
            {entry ? <li>Penicillin</li> : null}
        </AllergyRecordList>
    </Section>
);

describe("InternationalPatientSummarySection over a record list in conflict (P50-T29)", () => {
    test("the section's none-known line steps aside, and the entry stays", async () => {
        const { container } = render(host(true));
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
        expect(container.querySelector(".international-patient-summary-section-status")).toBeNull();
        expect(container.querySelector('[data-status="conflict"]')).not.toBeNull();
        expect(container.textContent).toContain("Penicillin");
    });

    test("with no entry, the section says none known as before", async () => {
        const { container } = render(host(false));
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
        expect(
            container.querySelector(".international-patient-summary-section-status")?.textContent,
        ).toBe("No known allergies");
    });
});
