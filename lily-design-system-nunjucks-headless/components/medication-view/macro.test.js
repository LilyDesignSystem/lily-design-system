import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("medication-view", () => {
    it("renders a span with each part", () => {
        const { document } = render("medication-view", {
            name: "amoxicillin",
            strength: "500 mg",
            form: "capsule",
            route: "oral",
            frequency: "three times daily",
        });
        const root = document.querySelector("span.medication-view");
        for (const [name, text] of [
            ["name", "amoxicillin"],
            ["strength", "500 mg"],
            ["form", "capsule"],
            ["route", "oral"],
            ["frequency", "three times daily"],
        ])
            expect(root.querySelector(`.medication-view-${name}`).textContent).toBe(text);
    });

    it("marks the consumer's tall man segments, and writes none of its own", () => {
        const a = render("medication-view", {
            nameSegments: [{ text: "hydr" }, { text: "ALAZINE", tallMan: true }],
        }).document;
        expect(a.querySelector(".medication-view-name").textContent).toBe("hydrALAZINE");
        const marked = a.querySelectorAll(".medication-view-tall-man");
        expect(marked).toHaveLength(1);
        expect(marked[0].textContent).toBe("ALAZINE");
        const b = render("medication-view", { name: "hydroxyzine HCl" }).document;
        expect(b.querySelector(".medication-view-tall-man")).toBeNull();
    });
});
