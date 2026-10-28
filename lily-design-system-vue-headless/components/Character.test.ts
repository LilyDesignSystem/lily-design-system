import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Character.vue";

describe("Character", () => {
    test("renders with img role and aria-label", () => {
        render(Subject, { props: { label: "Check mark" }, slots: { default: "✓" } });

        const el = screen.getByRole("img", { name: "Check mark" });
        expect(el).toBeTruthy();
        expect(el.textContent).toContain("✓");
    });

    test("is aria-hidden when decorative", () => {
        render(Subject, {
            props: { decorative: true, "data-testid": "char" },
            slots: { default: "★" },
        });

        const el = screen.getByTestId("char");
        expect(el.getAttribute("aria-hidden")).toBe("true");
        expect(el.getAttribute("role")).toBe("presentation");
    });

    test("does not have aria-hidden when not decorative", () => {
        render(Subject, { props: { label: "Star" }, slots: { default: "★" } });

        const el = screen.getByRole("img");
        expect(el.getAttribute("aria-hidden")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Test", "data-testid": "char" },
            slots: { default: "X" },
        });

        expect(screen.getByTestId("char")).toBeTruthy();
    });
});
