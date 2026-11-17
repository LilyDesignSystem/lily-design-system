import { fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./QuantityInputDiv.vue";

const units = [
    { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
    { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
];

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("QuantityInputDiv", () => {
    test("renders a named group with a labelled number and a labelled unit select", () => {
        render(Subject, {
            props: { label: "Weight", magnitudeLabel: "Amount", unitLabel: "Unit", units },
        });
        expect(screen.getByRole("group", { name: "Weight" }).className).toContain(
            "quantity-input-div",
        );
        expect((screen.getByLabelText("Amount") as HTMLInputElement).type).toBe("number");
        expect((screen.getByLabelText("Unit") as HTMLSelectElement).value).toBe("kg");
    });

    test("the number takes the limits of the unit chosen, and keeps its value", async () => {
        render(Subject, {
            props: { label: "Weight", magnitudeLabel: "Amount", unitLabel: "Unit", units },
        });
        const number = screen.getByLabelText("Amount") as HTMLInputElement;
        await fireEvent.update(number, "70");
        expect(number.max).toBe("300");
        await fireEvent.update(screen.getByLabelText("Unit"), "[lb_av]");
        expect(number.max).toBe("660");
        expect(number.value).toBe("70");
    });

    test("one unit is text, linked to the number, and submitted with it", () => {
        const { container } = render(Subject, {
            props: { label: "Weight", magnitudeLabel: "Amount", units: [units[0]], name: "weight" },
        });
        expect(container.querySelector("select")).toBeNull();
        const unit = container.querySelector(".quantity-input-div-unit") as HTMLElement;
        expect(screen.getByLabelText("Amount").getAttribute("aria-describedby")).toBe(unit.id);
        expect((container.querySelector('input[type="hidden"]') as HTMLInputElement).name).toBe(
            "weight-unit",
        );
    });
});
