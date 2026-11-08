import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders with content", () => {
        render(TextAreaInputWithCharacterCounter, { props: { label: "Test", maxLength: 100 } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        const wrapper = el.closest(".text-area-input-with-character-counter");
        expect(wrapper).toBeTruthy();
    });

    test("counts with the numbers alone by default: no English", () => {
        const { container } = render(TextAreaInputWithCharacterCounter, {
            props: { label: "Test", maxLength: 100 },
        });
        expect(container.textContent).toContain("0 / 100");
        expect(container.textContent).not.toMatch(/characters|of/);
    });

    test("fills in the consumer's counterTemplate", () => {
        const { container } = render(TextAreaInputWithCharacterCounter, {
            props: {
                label: "Test",
                maxLength: 100,
                counterTemplate: "{count} de {max} caractères",
            },
        });
        expect(container.textContent).toContain("0 de 100 caractères");
    });
});
