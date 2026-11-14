import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MedicationView.vue";

describe("MedicationView", () => {
    test("renders a span with each part", () => {
        const { container } = render(Subject, {
            props: {
                name: "amoxicillin",
                strength: "500 mg",
                form: "capsule",
                route: "oral",
                frequency: "three times daily",
            },
        });
        const root = container.querySelector(".medication-view") as HTMLElement;
        expect(root.tagName).toBe("SPAN");
        for (const [name, text] of [
            ["name", "amoxicillin"],
            ["strength", "500 mg"],
            ["form", "capsule"],
            ["route", "oral"],
            ["frequency", "three times daily"],
        ])
            expect(root.querySelector(`.medication-view-${name}`)?.textContent).toBe(text);
    });

    test("marks the consumer's tall man segments, and writes none of its own", () => {
        const a = render(Subject, {
            props: { nameSegments: [{ text: "hydr" }, { text: "ALAZINE", tallMan: true }] },
        });
        const marked = a.container.querySelectorAll(".medication-view-tall-man");
        expect(marked).toHaveLength(1);
        expect(marked[0].textContent).toBe("ALAZINE");
        expect(a.container.querySelector(".medication-view-name")?.textContent).toBe("hydrALAZINE");
        const b = render(Subject, { props: { name: "hydroxyzine HCl" } });
        expect(b.container.querySelector(".medication-view-tall-man")).toBeNull();
    });
});
