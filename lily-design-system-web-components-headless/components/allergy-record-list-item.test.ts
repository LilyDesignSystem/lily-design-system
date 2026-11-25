import { afterEach, describe, expect, test } from "vitest";

import { AllergyRecordListItem } from "./allergy-record-list-item.js";

if (!customElements.get("lily-allergy-record-list-item"))
    customElements.define("lily-allergy-record-list-item", AllergyRecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("AllergyRecordListItem", () => {
    test("replaces itself with an li holding each part, each status as text and data", () => {
        document.body.innerHTML = `<ul><lily-allergy-record-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severity-label="Severe" criticality="high" criticality-label="High risk" clinical-status="active" clinical-status-label="Active" verification-status="confirmed" verification-status-label="Confirmed" type-label="Allergy" category-label="Medication" updated="2026-11-03" updated-label="Updated 3 Nov 2026"></lily-allergy-record-list-item></ul>`;
        expect(document.querySelector("lily-allergy-record-list-item")).toBeNull();
        const li = document.querySelector("ul > li.allergy-record-list-item") as HTMLElement;
        expect(li.getAttribute("data-severity")).toBe("severe");
        expect(li.getAttribute("data-criticality")).toBe("high");
        expect(li.getAttribute("data-clinical-status")).toBe("active");
        expect(li.getAttribute("data-verification-status")).toBe("confirmed");
        expect(li.querySelector(".allergy-record-list-item-substance")?.textContent).toBe(
            "Penicillin",
        );
        expect(li.querySelector(".allergy-record-list-item-reaction")?.textContent).toBe(
            "Anaphylaxis",
        );
        expect(li.querySelector(".allergy-record-list-item-severity")?.textContent).toBe("Severe");
        expect(li.querySelector(".allergy-record-list-item-criticality")?.textContent).toBe(
            "High risk",
        );
        expect(li.querySelector(".allergy-record-list-item-clinical-status")?.textContent).toBe(
            "Active",
        );
        expect(li.querySelector(".allergy-record-list-item-verification-status")?.textContent).toBe(
            "Confirmed",
        );
        expect(li.querySelector(".allergy-record-list-item-type")?.textContent).toBe("Allergy");
        expect(li.querySelector(".allergy-record-list-item-category")?.textContent).toBe(
            "Medication",
        );
        expect(
            li.querySelector("time.allergy-record-list-item-updated")?.getAttribute("datetime"),
        ).toBe("2026-11-03");
        expect(li.querySelector("time.allergy-record-list-item-updated")?.textContent).toBe(
            "Updated 3 Nov 2026",
        );
    });

    test("renders only the parts that are given", () => {
        document.body.innerHTML = `<ul><lily-allergy-record-list-item substance="Penicillin"></lily-allergy-record-list-item></ul>`;
        const li = document.querySelector("ul > li.allergy-record-list-item") as HTMLElement;
        expect(li.querySelector(".allergy-record-list-item-reaction")).toBeNull();
        expect(li.querySelector(".allergy-record-list-item-severity")).toBeNull();
        expect(li.querySelector(".allergy-record-list-item-criticality")).toBeNull();
        expect(li.querySelector(".allergy-record-list-item-clinical-status")).toBeNull();
        expect(li.querySelector(".allergy-record-list-item-verification-status")).toBeNull();
        expect(li.querySelector(".allergy-record-list-item-type")).toBeNull();
        expect(li.querySelector(".allergy-record-list-item-category")).toBeNull();
        expect(li.querySelector(".allergy-record-list-item-updated")).toBeNull();
        expect(li.hasAttribute("data-severity")).toBe(false);
        expect(li.hasAttribute("data-criticality")).toBe(false);
        expect(li.hasAttribute("data-clinical-status")).toBe(false);
        expect(li.hasAttribute("data-verification-status")).toBe(false);
    });

    test("HC-C11: subjectLabel says whose record it is, first, when it is not the patient's", () => {
        document.body.innerHTML = `<ul><lily-allergy-record-list-item substance="Penicillin" clinical-status="active" clinical-status-label="Active" verification-status="confirmed" verification-status-label="Confirmed" subject-label="Mother"></lily-allergy-record-list-item></ul>`;
        const root = document.querySelector(".allergy-record-list-item") as HTMLElement;
        const subject = root.querySelector(".allergy-record-list-item-subject");
        expect(subject?.textContent).toBe("Mother");
        expect(root.firstElementChild).toBe(subject);
    });
});
