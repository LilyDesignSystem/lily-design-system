import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./EireIndividualHealthIdentifierInput";

describe("EireIndividualHealthIdentifierInput", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(() => <Subject label="Demo" />);
        const el = container.querySelector(".eire-individual-health-identifier-input");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("input");
    });

    test("appends className prop to root", () => {
        const { container } = render(() => (
            <Subject
                label="Demo"
                class="extra"
            />
        ));
        const el = container.querySelector(".eire-individual-health-identifier-input");
        expect(el?.className).toContain("eire-individual-health-identifier-input");
        expect(el?.className).toContain("extra");
    });
});
