import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TuaisceartEireannHealthAndCareNumberView.vue";

describe("TuaisceartEireannHealthAndCareNumberView", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(Subject, { props: { label: "Demo" } });
        const el = container.querySelector(".tuaisceart-eireann-health-and-care-number-view");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("span");
    });

    test("appends class prop to root", () => {
        const { container } = render(Subject, { props: { label: "Demo", class: "extra" } });
        const el = container.querySelector(".tuaisceart-eireann-health-and-care-number-view");
        expect(el?.className).toContain("tuaisceart-eireann-health-and-care-number-view");
        expect(el?.className).toContain("extra");
    });
});
