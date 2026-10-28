import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Footer.vue";

describe("Footer", () => {
    test("renders as contentinfo landmark", () => {
        render(Subject, { slots: { default: "Copyright" } });
        expect(screen.getByRole("contentinfo")).toBeTruthy();
    });

    test("supports aria-label", () => {
        render(Subject, { props: { label: "Site footer" }, slots: { default: "C" } });
        expect(screen.getByRole("contentinfo").getAttribute("aria-label")).toBe("Site footer");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "2024 All rights" } });
        expect(screen.getByRole("contentinfo").textContent).toContain("2024 All rights");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "ft" }, slots: { default: "C" } });
        expect(screen.getByTestId("ft")).toBeTruthy();
    });
});
