import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./RangeFieldset.vue";

const base = { legend: "Price", minimumLabel: "Lowest price", maximumLabel: "Highest price" };

function thumbs() {
    return {
        lower: screen.getByLabelText("Lowest price") as HTMLInputElement,
        upper: screen.getByLabelText("Highest price") as HTMLInputElement,
    };
}

describe("RangeFieldset", () => {
    test("is a fieldset named by its legend, with two range inputs on one scale", () => {
        render(Subject, { props: { ...base, min: 10, max: 90, step: 5 } });
        const group = screen.getByRole("group", { name: "Price" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.className).toContain("range-fieldset");
        expect(group.querySelector("legend.range-fieldset-legend")?.textContent).toBe("Price");
        const { lower, upper } = thumbs();
        expect(lower.className).toBe("range-fieldset-minimum");
        expect(upper.className).toBe("range-fieldset-maximum");
        for (const input of [lower, upper]) {
            expect(input.type).toBe("range");
            expect(input.min).toBe("10");
            expect(input.max).toBe("90");
            expect(input.step).toBe("5");
        }
        expect(lower.value).toBe("10");
        expect(upper.value).toBe("90");
    });

    test("the lower thumb stops at the upper one", async () => {
        const { emitted } = render(Subject, { props: { ...base, minimum: 20, maximum: 60 } });
        const { lower } = thumbs();
        await fireEvent.update(lower, "80");
        expect(lower.value).toBe("60");
        expect(emitted().change.at(-1)).toEqual([60, 60]);
        expect(emitted()["update:minimum"].at(-1)).toEqual([60]);
    });

    test("the upper thumb stops at the lower one", async () => {
        render(Subject, { props: { ...base, minimum: 20, maximum: 60 } });
        const { upper } = thumbs();
        await fireEvent.update(upper, "5");
        expect(upper.value).toBe("20");
    });

    test("both values submit as their own form fields", () => {
        const { container } = render(Subject, {
            props: {
                ...base,
                minimum: 25,
                maximum: 75,
                minimumName: "price-min",
                maximumName: "price-max",
            },
        });
        const form = document.createElement("form");
        form.append(container.querySelector("fieldset")!);
        const data = new FormData(form);
        expect(data.get("price-min")).toBe("25");
        expect(data.get("price-max")).toBe("75");
    });

    test("a form reset puts both thumbs back", async () => {
        const { container } = render(Subject, { props: { ...base, minimum: 25, maximum: 75 } });
        const form = document.createElement("form");
        form.append(container.querySelector("fieldset")!);
        const { lower, upper } = {
            lower: form.querySelector(".range-fieldset-minimum") as HTMLInputElement,
            upper: form.querySelector(".range-fieldset-maximum") as HTMLInputElement,
        };
        await fireEvent.update(lower, "40");
        await fireEvent.update(upper, "50");
        form.reset();
        expect(lower.value).toBe("25");
        expect(upper.value).toBe("75");
    });

    test("disabled disables both thumbs", () => {
        render(Subject, { props: { ...base, disabled: true } });
        expect((screen.getByRole("group") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: base, attrs: { "data-testid": "rf" } });
        expect(screen.getByTestId("rf")).toBeTruthy();
    });
});
