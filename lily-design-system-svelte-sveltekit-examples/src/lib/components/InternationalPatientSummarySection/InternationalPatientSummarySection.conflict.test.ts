// An IPS section never prints "none known" above a record list that holds an entry (HC-C17, tasks.md P50-T29).
import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import Host from "./SectionConflictTestHost.svelte";

const settle = async () => {
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
};

describe("InternationalPatientSummarySection over a record list in conflict (P50-T29)", () => {
    test("the section's none-known line steps aside, and the list's conflict words and entry stay", async () => {
        const { container } = render(Host, { props: { entry: true } });
        await settle();
        expect(container.querySelector(".international-patient-summary-section-status")).toBeNull();
        expect(container.querySelector('[data-status="conflict"]')).not.toBeNull();
        expect(container.textContent).toContain("Penicillin");
        expect(container.textContent).not.toContain("No known allergies");
    });

    test("with no entry, the section says none known as before", async () => {
        const { container } = render(Host, { props: { entry: false } });
        await settle();
        expect(
            container.querySelector(".international-patient-summary-section-status")?.textContent,
        ).toBe("No known allergies");
    });
});
