import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView.vue";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Labor Identification Code", value: "test-value" } });

        const el = screen.getByLabelText("Labor Identification Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("argentina-codigo-unico-de-identificacion-laboral-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Labor Identification Code", value: "test-value" } });

        const el = screen.getByLabelText("Labor Identification Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Labor Identification Code" } });

        const el = screen.getByLabelText("Labor Identification Code");
        expect(el.getAttribute("aria-label")).toBe("Labor Identification Code");
    });
});
