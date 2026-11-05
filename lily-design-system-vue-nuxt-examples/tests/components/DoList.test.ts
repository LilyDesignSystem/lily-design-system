import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/DoList.vue";

describe("DoList", () => {
    test("renders as a list", () => {
        render(Subject, { slots: { default: "Items" } });
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("has no English label of its own", () => {
        render(Subject, { slots: { default: "Items" } });
        expect(screen.getByRole("list").hasAttribute("aria-label")).toBe(false);
    });

    test("accepts custom label", () => {
        render(Subject, { props: { label: "Recommended" }, slots: { default: "Items" } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Recommended");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Use alt text" } });
        expect(screen.getByRole("list").textContent).toContain("Use alt text");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "dl" }, slots: { default: "C" } });
        expect(screen.getByTestId("dl")).toBeTruthy();
    });
});
