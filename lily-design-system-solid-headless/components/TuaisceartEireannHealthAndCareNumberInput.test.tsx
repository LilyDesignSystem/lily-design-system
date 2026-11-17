import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./TuaisceartEireannHealthAndCareNumberInput";

describe("TuaisceartEireannHealthAndCareNumberInput", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(() => <Subject label="Demo" />);
        const el = container.querySelector(".tuaisceart-eireann-health-and-care-number-input");
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
        const el = container.querySelector(".tuaisceart-eireann-health-and-care-number-input");
        expect(el?.className).toContain("tuaisceart-eireann-health-and-care-number-input");
        expect(el?.className).toContain("extra");
    });
});
