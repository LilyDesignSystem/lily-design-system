import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CheckList.vue";

describe("CheckList", () => {
    test("renders as a list", () => {
        render(Subject, { props: { label: "Tasks" }, slots: { default: "Items" } });
        expect(screen.getByRole("list", { name: "Tasks" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Task 1" } });
        expect(screen.getByRole("list").textContent).toContain("Task 1");
    });

    test("applies aria-label", () => {
        render(Subject, { props: { label: "Onboarding" }, slots: { default: "Items" } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Onboarding");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "cl" }, slots: { default: "Items" } });
        expect(screen.getByTestId("cl")).toBeTruthy();
    });
});
