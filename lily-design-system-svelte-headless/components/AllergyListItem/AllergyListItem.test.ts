import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AllergyListItem.svelte";

const root = () => document.querySelector(".allergy-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.allergy-list-item-${name}`);

describe("AllergyListItem", () => {
    test("renders an li with substance, reaction, severity and update as parts", () => {
        render(Subject, {
            props: {
                substance: "Penicillin",
                reaction: "Anaphylaxis",
                severity: "severe",
                severityLabel: "Severe",
                updated: "2026-11-03",
                updatedLabel: "Updated 3 Nov 2026",
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-severity")).toBe("severe");
        expect(part("substance")?.textContent).toBe("Penicillin");
        expect(part("reaction")?.textContent).toBe("Anaphylaxis");
        expect(part("severity")?.textContent).toBe("Severe");
        const time = part("updated") as HTMLTimeElement;
        expect(time.tagName).toBe("TIME");
        expect(time.getAttribute("datetime")).toBe("2026-11-03");
        expect(time.textContent).toBe("Updated 3 Nov 2026");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: { substance: "Latex" } });
        expect(part("substance")?.textContent).toBe("Latex");
        expect(part("reaction")).toBeNull();
        expect(part("severity")).toBeNull();
        expect(part("updated")).toBeNull();
        expect(root().hasAttribute("data-severity")).toBe(false);
    });
});
