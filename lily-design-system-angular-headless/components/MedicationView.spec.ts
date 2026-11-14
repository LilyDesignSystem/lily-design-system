import { TestBed } from "@angular/core/testing";
import { describe, expect, test } from "vitest";

import { MedicationView } from "./MedicationView";

function mount(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(MedicationView);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(".medication-view") as HTMLElement;
}

describe("MedicationView", () => {
    test("renders a span with each part", () => {
        const root = mount({
            name: "amoxicillin",
            strength: "500 mg",
            form: "capsule",
            route: "oral",
            frequency: "three times daily",
        });
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
        const a = mount({ nameSegments: [{ text: "hydr" }, { text: "ALAZINE", tallMan: true }] });
        expect(a.querySelector(".medication-view-name")?.textContent).toBe("hydrALAZINE");
        const marked = a.querySelectorAll(".medication-view-tall-man");
        expect(marked).toHaveLength(1);
        expect(marked[0].textContent).toBe("ALAZINE");
        const b = mount({ name: "hydroxyzine HCl" });
        expect(b.querySelector(".medication-view-tall-man")).toBeNull();
    });
});
