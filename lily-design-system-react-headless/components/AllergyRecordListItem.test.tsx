import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AllergyRecordListItem";

describe("AllergyRecordListItem", () => {
    test("renders an li with each part", () => {
        const { container } = render(
            <Subject
                substance="Penicillin"
                reaction="Anaphylaxis"
                severity="severe"
                severityLabel="Severe"
                updated="2026-11-03"
                updatedLabel="Updated 3 Nov 2026"
            />,
        );
        const root = container.querySelector(".allergy-record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-severity")).toBe("severe");
        expect(root.querySelector(".allergy-record-list-item-substance")?.textContent).toBe("Penicillin");
        expect(root.querySelector(".allergy-record-list-item-reaction")?.textContent).toBe("Anaphylaxis");
        expect(root.querySelector(".allergy-record-list-item-severity")?.textContent).toBe("Severe");
        const time = root.querySelector(".allergy-record-list-item-updated") as HTMLElement;
        expect(time.tagName).toBe("TIME");
        expect(time.getAttribute("datetime")).toBe("2026-11-03");
    });

    test("renders only the parts that are given", () => {
        const { container } = render(<Subject substance="Latex" />);
        expect(container.querySelector(".allergy-record-list-item-reaction")).toBeNull();
        expect(container.querySelector(".allergy-record-list-item-updated")).toBeNull();
    });
});
