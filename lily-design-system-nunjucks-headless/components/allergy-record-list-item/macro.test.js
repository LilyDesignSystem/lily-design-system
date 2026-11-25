import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("allergy-record-list-item", () => {
    it("renders an li with each part, each status as text and data", () => {
        const { document } = render("allergy-record-list-item", {
            substance: "Penicillin",
            reaction: "Anaphylaxis",
            severity: "severe",
            severityLabel: "Severe",
            criticality: "high",
            criticalityLabel: "High risk",
            clinicalStatus: "active",
            clinicalStatusLabel: "Active",
            verificationStatus: "confirmed",
            verificationStatusLabel: "Confirmed",
            typeLabel: "Allergy",
            categoryLabel: "Medication",
            updated: "2026-11-03",
            updatedLabel: "Updated 3 Nov 2026",
        });
        const root = document.querySelector("li.allergy-record-list-item");
        expect(root.getAttribute("data-severity")).toBe("severe");
        expect(root.getAttribute("data-criticality")).toBe("high");
        expect(root.getAttribute("data-clinical-status")).toBe("active");
        expect(root.getAttribute("data-verification-status")).toBe("confirmed");
        expect(root.querySelector(".allergy-record-list-item-substance").textContent).toBe(
            "Penicillin",
        );
        expect(root.querySelector(".allergy-record-list-item-reaction").textContent).toBe(
            "Anaphylaxis",
        );
        expect(root.querySelector(".allergy-record-list-item-severity").textContent).toBe("Severe");
        expect(root.querySelector(".allergy-record-list-item-criticality").textContent).toBe(
            "High risk",
        );
        expect(root.querySelector(".allergy-record-list-item-clinical-status").textContent).toBe(
            "Active",
        );
        expect(
            root.querySelector(".allergy-record-list-item-verification-status").textContent,
        ).toBe("Confirmed");
        expect(root.querySelector(".allergy-record-list-item-type").textContent).toBe("Allergy");
        expect(root.querySelector(".allergy-record-list-item-category").textContent).toBe(
            "Medication",
        );
        expect(
            root.querySelector("time.allergy-record-list-item-updated").getAttribute("datetime"),
        ).toBe("2026-11-03");
    });

    it("renders only the parts that are given", () => {
        const { document } = render("allergy-record-list-item", { substance: "Penicillin" });
        const root = document.querySelector("li.allergy-record-list-item");
        expect(root.querySelector(".allergy-record-list-item-reaction")).toBeNull();
        expect(root.querySelector(".allergy-record-list-item-severity")).toBeNull();
        expect(root.querySelector(".allergy-record-list-item-criticality")).toBeNull();
        expect(root.querySelector(".allergy-record-list-item-clinical-status")).toBeNull();
        expect(root.querySelector(".allergy-record-list-item-verification-status")).toBeNull();
        expect(root.querySelector(".allergy-record-list-item-type")).toBeNull();
        expect(root.querySelector(".allergy-record-list-item-category")).toBeNull();
        expect(root.querySelector(".allergy-record-list-item-updated")).toBeNull();
        expect(root.hasAttribute("data-severity")).toBe(false);
        expect(root.hasAttribute("data-criticality")).toBe(false);
        expect(root.hasAttribute("data-clinical-status")).toBe(false);
        expect(root.hasAttribute("data-verification-status")).toBe(false);
    });

    it("HC-C11: subjectLabel says whose record it is, first, when it is not the patient's", () => {
        const { document } = render("allergy-record-list-item", {
            substance: "Penicillin",
            clinicalStatus: "active",
            clinicalStatusLabel: "Active",
            verificationStatus: "confirmed",
            verificationStatusLabel: "Confirmed",
            subjectLabel: "Mother",
        });
        const root = document.querySelector(".allergy-record-list-item");
        const subject = root.querySelector(".allergy-record-list-item-subject");
        expect(subject.textContent).toBe("Mother");
        expect(root.firstElementChild).toBe(subject);
    });
});
