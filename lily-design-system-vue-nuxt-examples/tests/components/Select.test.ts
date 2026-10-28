import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Select.vue";

describe("Select", () => {
    test("renders a select element", () => {
        render(Subject, {
            props: { label: "Choice" },
            slots: { default: "<option>Alpha</option><option>Beta</option>" },
        });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Country" },
            slots: { default: "<option>Alpha</option><option>Beta</option>" },
        });
        expect(screen.getByLabelText("Country")).toBeTruthy();
    });

    test("renders children options", () => {
        render(Subject, {
            props: { label: "C" },
            slots: { default: "<option>Alpha</option><option>Beta</option>" },
        });
        expect(screen.getByText("Alpha")).toBeTruthy();
        expect(screen.getByText("Beta")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, {
            props: { label: "C", required: true },
            slots: { default: "<option>Alpha</option><option>Beta</option>" },
        });
        expect((screen.getByRole("combobox") as HTMLSelectElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, {
            props: { label: "C", disabled: true },
            slots: { default: "<option>Alpha</option><option>Beta</option>" },
        });
        expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "C", "data-testid": "sel" },
            slots: { default: "<option>Alpha</option><option>Beta</option>" },
        });
        expect(screen.getByTestId("sel")).toBeTruthy();
    });
});
