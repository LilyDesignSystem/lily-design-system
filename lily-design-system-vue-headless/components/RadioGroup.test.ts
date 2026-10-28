import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./RadioGroup.vue";

describe("RadioGroup", () => {
    test("renders a radiogroup", () => {
        render(Subject, { props: { label: "Size" }, slots: { default: "" } });
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Size" }, slots: { default: "" } });
        expect(screen.getByLabelText("Size")).toBeTruthy();
    });

    test("renders radio children", () => {
        render(Subject, {
            props: { label: "Size" },
            slots: {
                default:
                    "<label><input type='radio' name='size' value='s' /> Small</label><label><input type='radio' name='size' value='m' /> Medium</label>",
            },
        });
        expect(screen.getAllByRole("radio").length).toBe(2);
    });

    test("uses fieldset element", () => {
        render(Subject, { props: { label: "Size" }, slots: { default: "" } });
        expect(screen.getByRole("radiogroup").tagName).toBe("FIELDSET");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "rg" }, slots: { default: "" } });
        expect(screen.getByTestId("rg")).toBeTruthy();
    });
});
