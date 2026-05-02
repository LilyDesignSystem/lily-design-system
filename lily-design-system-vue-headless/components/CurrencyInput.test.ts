import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import Subject from "./CurrencyInput.vue";

describe("CurrencyInput", () => {
    test("renders an input with class currency-input", () => {
        const { container } = render(Subject, { props: { label: "Amount" } });
        const input = container.querySelector(".currency-input") as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.tagName).toBe("INPUT");
    });

    test("uses type=text and inputmode=decimal", () => {
        render(Subject, { props: { label: "Amount" } });
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.getAttribute("type")).toBe("text");
        expect(input.getAttribute("inputmode")).toBe("decimal");
    });

    test("displays the modelValue prop", () => {
        render(Subject, { props: { label: "Amount", modelValue: 42.5 } });
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.value).toBe("42.5");
    });

    test("displays empty string when modelValue is undefined", () => {
        render(Subject, { props: { label: "Amount" } });
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.value).toBe("");
    });

    test("emits update:modelValue with parsed number on input", async () => {
        const { emitted } = render(Subject, { props: { label: "Amount" } });
        const input = screen.getByLabelText("Amount");
        await fireEvent.update(input, "5");
        const events = emitted()["update:modelValue"];
        expect(events?.[events.length - 1]).toEqual([5]);
    });

    test("emits undefined when the input is cleared", async () => {
        const { emitted } = render(Subject, { props: { label: "Amount", modelValue: 5 } });
        const input = screen.getByLabelText("Amount");
        await fireEvent.update(input, "");
        const events = emitted()["update:modelValue"];
        expect(events?.[events.length - 1]).toEqual([undefined]);
    });

    test("exposes the currencyCode via data attribute", () => {
        render(Subject, { props: { label: "Amount", currencyCode: "EUR" } });
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.getAttribute("data-currency-code")).toBe("EUR");
    });

    test("defaults currencyCode to USD", () => {
        render(Subject, { props: { label: "Amount" } });
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.getAttribute("data-currency-code")).toBe("USD");
    });

    test("applies disabled attribute", () => {
        render(Subject, { props: { label: "Amount", disabled: true } });
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });
});
