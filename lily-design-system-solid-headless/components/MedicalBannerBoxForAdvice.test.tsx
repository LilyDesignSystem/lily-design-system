import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./MedicalBannerBoxForAdvice";

describe("MedicalBannerBoxForAdvice", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(() => <Subject label="Demo">content</Subject>);
        const el = container.querySelector(".medical-banner-box-for-advice");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(() => (
            <Subject
                label="Demo"
                class="extra"
            >
                content
            </Subject>
        ));
        const el = container.querySelector(".medical-banner-box-for-advice");
        expect(el?.className).toContain("medical-banner-box-for-advice");
        expect(el?.className).toContain("extra");
    });
});
