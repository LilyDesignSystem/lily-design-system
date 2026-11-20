import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./RangeFieldset";

const base = { legend: "Price", minimumLabel: "Lowest price", maximumLabel: "Highest price" };

function thumbs() {
    return {
        lower: screen.getByLabelText("Lowest price") as HTMLInputElement,
        upper: screen.getByLabelText("Highest price") as HTMLInputElement,
    };
}

describe("RangeFieldset", () => {
    test("is a fieldset named by its legend, with two range inputs on one scale", () => {
        render(
            <Subject
                {...base}
                min={10}
                max={90}
                step={5}
            />,
        );
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

    test("the lower thumb stops at the upper one", () => {
        const onChange = vi.fn();
        render(
            <Subject
                {...base}
                minimum={20}
                maximum={60}
                onChange={onChange}
            />,
        );
        const { lower } = thumbs();
        fireEvent.input(lower, { target: { value: "80" } });
        expect(lower.value).toBe("60");
        expect(onChange).toHaveBeenLastCalledWith(60, 60);
    });

    test("the upper thumb stops at the lower one", () => {
        render(
            <Subject
                {...base}
                minimum={20}
                maximum={60}
            />,
        );
        const { upper } = thumbs();
        fireEvent.input(upper, { target: { value: "5" } });
        expect(upper.value).toBe("20");
    });

    test("both values submit as their own form fields", () => {
        const { container } = render(
            <form>
                <Subject
                    {...base}
                    minimum={25}
                    maximum={75}
                    minimumName="price-min"
                    maximumName="price-max"
                />
            </form>,
        );
        const data = new FormData(container.querySelector("form")!);
        expect(data.get("price-min")).toBe("25");
        expect(data.get("price-max")).toBe("75");
    });

    test("a form reset puts both thumbs back", () => {
        const { container } = render(
            <form>
                <Subject
                    {...base}
                    minimum={25}
                    maximum={75}
                />
            </form>,
        );
        const { lower, upper } = thumbs();
        fireEvent.input(lower, { target: { value: "40" } });
        fireEvent.input(upper, { target: { value: "50" } });
        container.querySelector("form")!.reset();
        expect(lower.value).toBe("25");
        expect(upper.value).toBe("75");
    });

    test("after a form reset the thumbs stay back, and the next move clamps against them", async () => {
        const onChange = vi.fn();
        const { container } = render(
            <form>
                <Subject
                    {...base}
                    minimum={20}
                    maximum={80}
                    onChange={onChange}
                />
            </form>,
        );
        const { lower, upper } = thumbs();
        fireEvent.input(lower, { target: { value: "50" } });
        container.querySelector("form")!.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(lower.value).toBe("20");
        fireEvent.input(upper, { target: { value: "30" } });
        expect(upper.value).toBe("30");
    });

    test("disabled disables both thumbs", () => {
        render(
            <Subject
                {...base}
                disabled
            />,
        );
        expect((screen.getByRole("group") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                {...base}
                data-testid="rf"
            />,
        );
        expect(screen.getByTestId("rf")).toBeTruthy();
    });
});
