import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./MultiSelect.vue";

const OPTIONS = '<option value="a">Option A</option><option value="b">Option B</option><option value="c">Option C</option>';

function select() {
    return screen.getByLabelText("Pick") as HTMLSelectElement;
}

describe("MultiSelect", () => {
    test("renders a native <select multiple> with the base class", () => {
        render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        expect(select().tagName).toBe("SELECT");
        expect(select().multiple).toBe(true);
        expect(select().getAttribute("class")).toContain("multi-select");
    });

    test("is exposed as a listbox", () => {
        render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        expect(screen.getByRole("listbox", { name: "Pick" })).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    test("initial value array selects the matching options", () => {
        render(Subject, { props: { label: "Pick", modelValue: ["a", "c"] }, slots: { default: OPTIONS } });
        const selected = Array.from(select().selectedOptions).map((o) => o.value);
        expect(selected).toEqual(["a", "c"]);
    });

    test("selecting several options works natively", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        await user.selectOptions(select(), ["a", "b"]);
        const selected = Array.from(select().selectedOptions).map((o) => o.value);
        expect(selected).toEqual(["a", "b"]);
    });

    test("selection is emitted as a string array (v-model)", async () => {
        const user = userEvent.setup();
        const { emitted } = render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        await user.selectOptions(select(), ["a", "b"]);
        const events = emitted()["update:modelValue"] as unknown[][];
        expect(events[events.length - 1][0]).toEqual(["a", "b"]);
    });

    test("size sets the visible rows", () => {
        render(Subject, { props: { label: "Pick", size: 4 }, slots: { default: OPTIONS } });
        expect(select().getAttribute("size")).toBe("4");
    });

    test("supports required and disabled", () => {
        render(Subject, { props: { label: "Pick", required: true, disabled: true }, slots: { default: OPTIONS } });
        expect(select().required).toBe(true);
        expect(select().disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Pick", "data-testid": "ms" }, slots: { default: OPTIONS } });
        expect(screen.getByTestId("ms")).toBeTruthy();
    });
});
