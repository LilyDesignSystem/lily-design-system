import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "../../components/CalendarRangePicker.vue";

describe("CalendarRangePicker", () => {
    test("renders group role", () => {
        render(Subject, { props: { label: "Dates" }, slots: { default: "cal" } });
        expect(screen.getByRole("group")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "Select dates" }, slots: { default: "cal" } });
        expect(screen.getByLabelText("Select dates")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "D", "data-testid": "crp" }, slots: { default: "x" } });
        expect(screen.getByTestId("crp")).toBeTruthy();
    });
});
