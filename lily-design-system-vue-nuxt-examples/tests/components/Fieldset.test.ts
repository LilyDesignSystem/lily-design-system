import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Fieldset.vue";

describe("Fieldset", () => {
    test("renders as a group with legend", () => {
        render(Subject, { props: { legend: "Contact" }, slots: { default: "Fields" } });
        expect(screen.getByRole("group", { name: "Contact" })).toBeTruthy();
    });

    test("displays legend text", () => {
        render(Subject, { props: { legend: "Address" }, slots: { default: "Fields" } });
        expect(screen.getByText("Address")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, {
            props: { legend: "Info", disabled: true, "data-testid": "fs" },
            slots: { default: "C" },
        });
        expect((screen.getByTestId("fs") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("renders children", () => {
        render(Subject, { props: { legend: "G" }, slots: { default: "Child content" } });
        expect(screen.getByRole("group").textContent).toContain("Child content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { legend: "G", "data-testid": "fs" }, slots: { default: "C" } });
        expect(screen.getByTestId("fs")).toBeTruthy();
    });
});
