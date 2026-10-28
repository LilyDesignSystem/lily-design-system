import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./DontList.vue";

describe("DontList", () => {
    test("renders as a list", () => {
        render(Subject, { slots: { default: "Items" } });
        expect(screen.getByRole("list", { name: "Don't" })).toBeTruthy();
    });

    test("has default label", () => {
        render(Subject, { slots: { default: "Items" } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Don't");
    });

    test("accepts custom label", () => {
        render(Subject, { props: { label: "Avoid" }, slots: { default: "Items" } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Avoid");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Skip tests" } });
        expect(screen.getByRole("list").textContent).toContain("Skip tests");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "dnl" }, slots: { default: "C" } });
        expect(screen.getByTestId("dnl")).toBeTruthy();
    });
});
