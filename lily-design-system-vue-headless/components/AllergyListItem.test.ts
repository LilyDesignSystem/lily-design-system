import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./AllergyListItem.vue";

describe("AllergyListItem", () => {
    test("renders an li with each part", () => {
        const { container } = render(Subject, {
            props: {
                substance: "Penicillin",
                reaction: "Anaphylaxis",
                severity: "severe",
                severityLabel: "Severe",
                updated: "2026-11-03",
                updatedLabel: "Updated 3 Nov 2026",
            },
        });
        const root = container.querySelector(".allergy-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-severity")).toBe("severe");
        expect(root.querySelector(".allergy-list-item-substance")?.textContent).toBe("Penicillin");
        expect(root.querySelector(".allergy-list-item-reaction")?.textContent).toBe("Anaphylaxis");
        expect(root.querySelector(".allergy-list-item-severity")?.textContent).toBe("Severe");
        expect(root.querySelector("time.allergy-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });

    test("renders only the parts that are given", () => {
        const { container } = render(Subject, { props: { substance: "Latex" } });
        expect(container.querySelector(".allergy-list-item-reaction")).toBeNull();
        expect(container.querySelector(".allergy-list-item-updated")).toBeNull();
    });
});
