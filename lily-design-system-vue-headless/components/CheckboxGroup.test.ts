import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CheckboxGroup.vue";

describe("CheckboxGroup", () => {
    test("renders a group", () => {
        render(Subject, { props: { label: "Features" }, slots: { default: "" } });
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Features" }, slots: { default: "" } });
        expect(screen.getByLabelText("Features")).toBeTruthy();
    });

    test("renders checkbox children", () => {
        render(Subject, {
            props: { label: "Features" },
            slots: {
                default:
                    "<label><input type='checkbox' name='features' value='wifi' /> Wi-Fi</label><label><input type='checkbox' name='features' value='bluetooth' /> Bluetooth</label>",
            },
        });
        expect(screen.getAllByRole("checkbox").length).toBe(2);
    });

    test("uses fieldset element", () => {
        render(Subject, { props: { label: "Features" }, slots: { default: "" } });
        expect(screen.getByRole("group").tagName).toBe("FIELDSET");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Features", disabled: true }, slots: { default: "" } });
        expect((screen.getByRole("group") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "cg" }, slots: { default: "" } });
        expect(screen.getByTestId("cg")).toBeTruthy();
    });
});
