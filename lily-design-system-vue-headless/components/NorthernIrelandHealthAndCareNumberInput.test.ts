import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./NorthernIrelandHealthAndCareNumberInput.vue";

describe("NorthernIrelandHealthAndCareNumberInput", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(Subject, { props: { label: "Demo" } });
        const el = container.querySelector(".northern-ireland-health-and-care-number-input");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("input");
    });

    test("appends class prop to root", () => {
        const { container } = render(Subject, { props: { label: "Demo", class: "extra" } });
        const el = container.querySelector(".northern-ireland-health-and-care-number-input");
        expect(el?.className).toContain("northern-ireland-health-and-care-number-input");
        expect(el?.className).toContain("extra");
    });
});
