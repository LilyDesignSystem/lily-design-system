import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MedicalBannerBox.vue";

describe("MedicalBannerBox", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(Subject, { props: { label: "Demo" } });
        const el = container.querySelector(".medical-banner-box");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends class prop to root", () => {
        const { container } = render(Subject, { props: { label: "Demo", class: "extra" } });
        const el = container.querySelector(".medical-banner-box");
        expect(el?.className).toContain("medical-banner-box");
        expect(el?.className).toContain("extra");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Subject, {
            props: { label: "Story" },
            slots: { default: "content" },
        });
        const root = container.querySelector(".medical-banner-box");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.querySelector(".medical-banner-box")?.hasAttribute("role")).toBe(false);
    });
});
