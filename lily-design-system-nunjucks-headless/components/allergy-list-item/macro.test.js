import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("allergy-list-item", () => {
    it("renders an li with each part", () => {
        const { document } = render("allergy-list-item", {
            substance: "Penicillin",
            reaction: "Anaphylaxis",
            severity: "severe",
            severityLabel: "Severe",
            updated: "2026-11-03",
            updatedLabel: "Updated 3 Nov 2026",
        });
        const root = document.querySelector("li.allergy-list-item");
        expect(root.getAttribute("data-severity")).toBe("severe");
        expect(root.querySelector(".allergy-list-item-substance").textContent).toBe("Penicillin");
        expect(root.querySelector(".allergy-list-item-reaction").textContent).toBe("Anaphylaxis");
        expect(root.querySelector(".allergy-list-item-severity").textContent).toBe("Severe");
        expect(root.querySelector("time.allergy-list-item-updated").getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });

    it("renders only the parts that are given", () => {
        const { document } = render("allergy-list-item", { substance: "Latex" });
        expect(document.querySelector(".allergy-list-item-reaction")).toBeNull();
        expect(document.querySelector(".allergy-list-item").hasAttribute("data-severity")).toBe(
            false,
        );
    });
});
