import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/SelectWithExtras.vue";

describe("SelectWithExtras", () => {
    test("renders a select", () => {
        render(Subject, {
            props: { label: "Choose" },
            slots: { default: "<option>Option A</option>" },
        });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Pick one" },
            slots: { default: "<option>Option A</option>" },
        });
        expect(screen.getByLabelText("Pick one")).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, {
            props: { label: "Choose" },
            slots: { default: "<option>Option A</option>" },
        });
        expect(screen.getByText("Option A")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, {
            props: { label: "Choose", required: true },
            slots: { default: "<option>Option A</option>" },
        });
        expect((screen.getByRole("combobox") as HTMLSelectElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "C", "data-testid": "swe" },
            slots: { default: "<option>Option A</option>" },
        });
        expect(screen.getByTestId("swe")).toBeTruthy();
    });
});
