import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ThemeSelect.vue";

describe("ThemeSelect", () => {
    test("renders a select", () => {
        render(Subject, {
            props: { label: "Theme" },
            slots: { default: "<option>Light</option><option>Dark</option>" },
        });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Choose theme" },
            slots: { default: "<option>Light</option><option>Dark</option>" },
        });
        expect(screen.getByLabelText("Choose theme")).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, {
            props: { label: "Theme" },
            slots: { default: "<option>Light</option><option>Dark</option>" },
        });
        expect(screen.getByText("Light")).toBeTruthy();
        expect(screen.getByText("Dark")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "T", "data-testid": "tc" },
            slots: { default: "<option>Light</option><option>Dark</option>" },
        });
        expect(screen.getByTestId("tc")).toBeTruthy();
    });
});
