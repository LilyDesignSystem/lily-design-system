import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Option.vue";

describe("Option", () => {
    test("renders an option element", () => {
        render(Subject, { props: { value: "a" }, slots: { default: "Alpha" } });
        expect(screen.getByRole("option")).toBeTruthy();
    });

    test("has the correct value", () => {
        render(Subject, { props: { value: "us" }, slots: { default: "United States" } });
        expect((screen.getByRole("option") as HTMLOptionElement).value).toBe("us");
    });

    test("renders children text", () => {
        render(Subject, { props: { value: "uk" }, slots: { default: "United Kingdom" } });
        expect(screen.getByRole("option").textContent).toContain("United Kingdom");
    });

    test("supports selected", () => {
        render(Subject, { props: { value: "a", selected: true }, slots: { default: "A" } });
        expect((screen.getByRole("option") as HTMLOptionElement).selected).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { value: "a", disabled: true }, slots: { default: "A" } });
        expect((screen.getByRole("option") as HTMLOptionElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: "a", "data-testid": "opt" }, slots: { default: "A" } });
        expect(screen.getByTestId("opt")).toBeTruthy();
    });
});
