// An IPS section never prints "none known" above a record list that holds an entry (HC-C17, tasks.md P50-T29).
import { render } from "@testing-library/vue";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, test } from "vitest";

import AllergyRecordList from "./AllergyRecordList.vue";
import Section from "./InternationalPatientSummarySection.vue";

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const host = (entry: boolean) =>
    defineComponent({
        render: () =>
            h(
                Section,
                {
                    section: "allergies",
                    heading: "Allergies",
                    status: "none-known",
                    statusLabel: "No known allergies",
                },
                () =>
                    h(
                        AllergyRecordList,
                        {
                            status: "none-known",
                            statusLabel: "No known allergies",
                            conflictLabel: "Check the source",
                        },
                        () => (entry ? [h("li", "Penicillin")] : []),
                    ),
            ),
    });

describe("InternationalPatientSummarySection over a record list in conflict (P50-T29)", () => {
    test("the section's none-known line steps aside, and the entry stays", async () => {
        const { container } = render(host(true));
        await settle();
        await nextTick();
        await settle();
        await nextTick();
        expect(container.querySelector(".international-patient-summary-section-status")).toBeNull();
        expect(container.querySelector('[data-status="conflict"]')).not.toBeNull();
        expect(container.textContent).toContain("Penicillin");
    });

    test("with no entry, the section says none known as before", async () => {
        const { container } = render(host(false));
        await settle();
        await nextTick();
        expect(
            container
                .querySelector(".international-patient-summary-section-status")
                ?.textContent?.trim(),
        ).toBe("No known allergies");
    });
});
