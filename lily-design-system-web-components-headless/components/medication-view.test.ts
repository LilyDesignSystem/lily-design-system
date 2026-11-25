import { afterEach, describe, expect, test, vi } from "vitest";

import { MedicationView } from "./medication-view.js";

if (!customElements.get("lily-medication-view"))
    customElements.define("lily-medication-view", MedicationView);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("MedicationView", () => {
    test("renders a span with each part", () => {
        const body = render(
            `<lily-medication-view name="amoxicillin" strength="500 mg" form="capsule" route="oral" frequency="three times daily"></lily-medication-view>`,
        );
        const root = body.querySelector("span.medication-view") as HTMLElement;
        for (const [name, text] of [
            ["name", "amoxicillin"],
            ["strength", "500 mg"],
            ["form", "capsule"],
            ["route", "oral"],
            ["frequency", "three times daily"],
        ])
            expect(root.querySelector(`.medication-view-${name}`)?.textContent).toBe(text);
    });

    test("HC-C6: marks the consumer\x27s tall man segments, and writes none of its own", () => {
        const a = render(
            `<lily-medication-view name-segments=\x27[{"text":"hydr"},{"text":"ALAZINE","tallMan":true}]\x27></lily-medication-view>`,
        );
        expect(a.querySelector(".medication-view-name")?.textContent).toBe("hydrALAZINE");
        expect(a.querySelectorAll(".medication-view-tall-man")).toHaveLength(1);
        const b = render(`<lily-medication-view name="hydroxyzine HCl"></lily-medication-view>`);
        expect(b.querySelector(".medication-view-tall-man")).toBeNull();
    });

    test("renders a free-text dose as its own part", () => {
        document.body.innerHTML = `<lily-medication-view name="metformin" dosage-text="Take one tablet twice a day with food"></lily-medication-view>`;
        expect(document.querySelector(".medication-view-dosage")?.textContent).toBe(
            "Take one tablet twice a day with food",
        );
    });
});
