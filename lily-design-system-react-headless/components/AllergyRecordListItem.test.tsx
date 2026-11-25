import { render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./AllergyRecordListItem";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(
            <Subject
                substance="Penicillin"
                reaction="Anaphylaxis"
                severity="severe"
                severityLabel="Severe"
                criticality="high"
                criticalityLabel="High risk"
                clinicalStatus="active"
                clinicalStatusLabel="Active"
                verificationStatus="confirmed"
                verificationStatusLabel="Confirmed"
                typeLabel="Allergy"
                categoryLabel="Medication"
                updated="2026-11-03"
                updatedLabel="Updated 3 Nov 2026"
            />,
        );
        const root = container.querySelector(".allergy-record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-severity")).toBe("severe");
        expect(root.getAttribute("data-criticality")).toBe("high");
        expect(root.getAttribute("data-clinical-status")).toBe("active");
        expect(root.getAttribute("data-verification-status")).toBe("confirmed");
        expect(root.querySelector(".allergy-record-list-item-substance")?.textContent).toBe(
            "Penicillin",
        );
        expect(root.querySelector(".allergy-record-list-item-reaction")?.textContent).toBe(
            "Anaphylaxis",
        );
        expect(root.querySelector(".allergy-record-list-item-severity")?.textContent).toBe(
            "Severe",
        );
        expect(root.querySelector(".allergy-record-list-item-criticality")?.textContent).toBe(
            "High risk",
        );
        expect(root.querySelector(".allergy-record-list-item-clinical-status")?.textContent).toBe(
            "Active",
        );
        expect(
            root.querySelector(".allergy-record-list-item-verification-status")?.textContent,
        ).toBe("Confirmed");
        expect(root.querySelector(".allergy-record-list-item-type")?.textContent).toBe("Allergy");
        expect(root.querySelector(".allergy-record-list-item-category")?.textContent).toBe(
            "Medication",
        );
        expect(
            root.querySelector("time.allergy-record-list-item-updated")?.getAttribute("datetime"),
        ).toBe("2026-11-03");
        expect(root.querySelector("time.allergy-record-list-item-updated")?.textContent).toBe(
            "Updated 3 Nov 2026",
        );
    });

    test("renders only the parts that are given", () => {
        const { container } = render(<Subject substance="Penicillin" />);
        const root = container.querySelector(".allergy-record-list-item") as HTMLElement;
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

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(
            <Subject
                substance="Penicillin"
                severity="severe"
            />,
        );
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("AllergyRecordListItem has no severityLabel"),
            ),
        ).toBe(true);
    });

    test("HC-C11: subjectLabel says whose record it is, first, when it is not the patient's", () => {
        const { container } = render(
            <Subject
                substance="Penicillin"
                clinicalStatus="active"
                clinicalStatusLabel="Active"
                verificationStatus="confirmed"
                verificationStatusLabel="Confirmed"
                subjectLabel="Mother"
            />,
        );
        const root = container.querySelector(".allergy-record-list-item") as HTMLElement;
        const subject = root.querySelector(".allergy-record-list-item-subject");
        expect(subject?.textContent).toBe("Mother");
        expect(root.firstElementChild).toBe(subject);
    });
});
