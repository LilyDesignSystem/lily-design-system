import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Combobox.vue";

describe("Combobox", () => {
    test("renders a combobox input", () => {
        render(Subject, {
            props: { label: "Fruit" },
            slots: { default: "<div role='option'>Apple</div>" },
        });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Search fruit" },
            slots: { default: "<div role='option'>Apple</div>" },
        });
        expect(screen.getByLabelText("Search fruit")).toBeTruthy();
    });

    test("listbox hidden when closed", () => {
        render(Subject, {
            props: { label: "Fruit", open: false },
            slots: { default: "<div role='option'>Apple</div>" },
        });
        expect(screen.queryByRole("listbox")).toBeNull();
    });

    test("listbox shown when open", () => {
        render(Subject, {
            props: { label: "Fruit", open: true },
            slots: { default: "<div role='option'>Apple</div>" },
        });
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-expanded", () => {
        render(Subject, {
            props: { label: "Fruit", open: true },
            slots: { default: "<div role='option'>Apple</div>" },
        });
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "F", "data-testid": "cb" },
            slots: { default: "<div role='option'>Apple</div>" },
        });
        expect(screen.getByTestId("cb")).toBeTruthy();
    });
});
