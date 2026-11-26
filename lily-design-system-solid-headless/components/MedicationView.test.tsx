import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./MedicationView";

describe("MedicationView", () => {
    test("renders a span with each part", () => {
        const { container } = render(() => (
            <Subject
                name="amoxicillin"
                strength="500 mg"
                form="capsule"
                route="oral"
                frequency="three times daily"
            />
        ));
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

    test("HC-C6: marks the consumer's tall man segments, and writes none of its own", () => {
        const a = render(() => (
            <Subject nameSegments={[{ text: "hydr" }, { text: "ALAZINE", tallMan: true }]} />
        ));
        const marked = a.container.querySelectorAll(".medication-view-tall-man");
        expect(marked).toHaveLength(1);
        expect(marked[0].textContent).toBe("ALAZINE");
        const b = render(() => <Subject name="hydroxyzine HCl" />);
        expect(b.container.querySelector(".medication-view-tall-man")).toBeNull();
    });

    test("renders a free-text dose as its own part", () => {
        const { container } = render(() => (
            <Subject
                name="metformin"
                dosageText="Take one tablet twice a day with food"
            />
        ));
        expect(container.querySelector(".medication-view-dosage")?.textContent).toBe(
            "Take one tablet twice a day with food",
        );
    });
});

describe("MedicationView name", () => {
    test("an empty list of segments falls back to the plain name, so the strength is never shown without a medicine (P55-T6)", () => {
        const { container } = render(() => (
            <Subject
                name="Example medicine"
                nameSegments={[]}
                strength="10 mg"
            />
        ));
        expect(container.querySelector(".medication-view-name")?.textContent).toBe(
            "Example medicine",
        );
    });
});
