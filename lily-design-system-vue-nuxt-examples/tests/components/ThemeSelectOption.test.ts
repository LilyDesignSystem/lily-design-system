import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ThemeSelectOption.vue";

describe("ThemeSelectOption", () => {
    test("renders an option element", () => {
        render(Subject, { props: { value: "dark" }, slots: { default: "Dark" } });
        expect(screen.getByRole("option")).toBeTruthy();
    });

    test("has the correct value", () => {
        render(Subject, { props: { value: "light" }, slots: { default: "Light" } });
        expect((screen.getByRole("option") as HTMLOptionElement).value).toBe("light");
    });

    test("renders children text", () => {
        render(Subject, { props: { value: "dark" }, slots: { default: "Dark Mode" } });
        expect(screen.getByRole("option").textContent).toContain("Dark Mode");
    });

    test("supports selected", () => {
        render(Subject, { props: { value: "dark", selected: true }, slots: { default: "Dark" } });
        expect((screen.getByRole("option") as HTMLOptionElement).selected).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { value: "dark", disabled: true }, slots: { default: "Dark" } });
        expect((screen.getByRole("option") as HTMLOptionElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { value: "dark", "data-testid": "tso" },
            slots: { default: "Dark" },
        });
        expect(screen.getByTestId("tso")).toBeTruthy();
    });
});
