import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MedicalBannerBoxForAdvice.vue";

describe("MedicalBannerBoxForAdvice", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(Subject, { props: { label: "Demo" } });
        const el = container.querySelector(".medical-banner-box-for-advice");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends class prop to root", () => {
        const { container } = render(Subject, { props: { label: "Demo", class: "extra" } });
        const el = container.querySelector(".medical-banner-box-for-advice");
        expect(el?.className).toContain("medical-banner-box-for-advice");
        expect(el?.className).toContain("extra");
    });
});
