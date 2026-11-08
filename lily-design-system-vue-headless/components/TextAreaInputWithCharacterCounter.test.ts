import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TextAreaInputWithCharacterCounter.vue";

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(Subject, { props: { label: "Demo" } });
        const el = container.querySelector(".text-area-input-with-character-counter");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends class prop to root", () => {
        const { container } = render(Subject, { props: { label: "Demo", class: "extra" } });
        const el = container.querySelector(".text-area-input-with-character-counter");
        expect(el?.className).toContain("text-area-input-with-character-counter");
        expect(el?.className).toContain("extra");
    });

    test("counts with the numbers alone by default: no English", () => {
        const { container } = render(Subject, { props: { label: "Demo", maxLength: 100 } });
        expect(container.textContent).toContain("0 / 100");
        expect(container.textContent).not.toMatch(/characters|of/);
    });

    test("fills in the consumer's counterTemplate", () => {
        const { container } = render(Subject, {
            props: {
                label: "Demo",
                maxLength: 100,
                counterTemplate: "{count} de {max} caractères",
            },
        });
        expect(container.textContent).toContain("0 de 100 caractères");
    });
});
