import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/SegmentGroupItem.vue";

describe("SegmentGroupItem", () => {
    test("renders a radio button", () => {
        render(Subject, { slots: { default: "Grid" } });
        expect(screen.getByRole("radio")).toBeTruthy();
    });

    test("has aria-checked false by default", () => {
        render(Subject, { slots: { default: "Grid" } });
        expect(screen.getByRole("radio").getAttribute("aria-checked")).toBe("false");
    });

    test("has aria-checked true when checked", () => {
        render(Subject, { props: { checked: true }, slots: { default: "Grid" } });
        expect(screen.getByRole("radio").getAttribute("aria-checked")).toBe("true");
    });

    test("has tabindex -1 when not checked", () => {
        render(Subject, { slots: { default: "Grid" } });
        expect(screen.getByRole("radio").getAttribute("tabindex")).toBe("-1");
    });

    test("has tabindex 0 when checked", () => {
        render(Subject, { props: { checked: true }, slots: { default: "Grid" } });
        expect(screen.getByRole("radio").getAttribute("tabindex")).toBe("0");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: "grid" }, slots: { default: "Grid" } });
        expect(screen.getByRole("radio").getAttribute("data-value")).toBe("grid");
    });

    test("is not disabled by default", () => {
        render(Subject, { slots: { default: "Grid" } });
        expect((screen.getByRole("radio") as HTMLButtonElement).disabled).toBe(false);
    });

    test("supports disabled state", () => {
        render(Subject, { props: { disabled: true }, slots: { default: "Grid" } });
        expect((screen.getByRole("radio") as HTMLButtonElement).disabled).toBe(true);
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "List View" } });
        expect(screen.getByText("List View")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "sgi" }, slots: { default: "x" } });
        expect(screen.getByTestId("sgi")).toBeTruthy();
    });
});
