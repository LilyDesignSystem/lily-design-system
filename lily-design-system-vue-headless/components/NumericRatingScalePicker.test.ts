import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./NumericRatingScalePicker.vue";

const props = {
    label: "How bad is your pain now?",
    minLabel: "No pain",
    maxLabel: "Worst pain imaginable",
};

describe("NumericRatingScalePicker", () => {
    test("is a fieldset named by its legend, with radios from 0 to 10 and described ends", () => {
        render(Subject, { props });
        expect(screen.getByRole("group", { name: "How bad is your pain now?" }).tagName).toBe(
            "FIELDSET",
        );
        expect(screen.getAllByRole("radio")).toHaveLength(11);
        expect(screen.getByRole("radio", { name: "0", description: "No pain" })).toBeTruthy();
        expect(
            screen.getByRole("radio", { name: "10", description: "Worst pain imaginable" }),
        ).toBeTruthy();
    });

    test("arrow keys move and choose, and v-model follows", async () => {
        const user = userEvent.setup();
        const { emitted } = render(Subject, { props: { ...props, modelValue: "3" } });
        screen.getByRole("radio", { name: "3" }).focus();
        await user.keyboard("{ArrowRight}");
        expect((screen.getByRole("radio", { name: "4" }) as HTMLInputElement).checked).toBe(true);
        expect(emitted()["update:modelValue"]?.at(-1)).toEqual(["4"]);
    });
});
