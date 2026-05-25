import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MedicalBanner.vue";

describe("MedicalBanner", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(Subject, { props: { label: "Demo" } });
        const el = container.querySelector(".medical-banner");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends class prop to root", () => {
        const { container } = render(Subject, { props: { label: "Demo", class: "extra" } });
        const el = container.querySelector(".medical-banner");
        expect(el?.className).toContain("medical-banner");
        expect(el?.className).toContain("extra");
    });
});
