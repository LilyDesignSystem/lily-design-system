import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ArgentinaCodigoUnicoDeIdentificacionLaboralInput.vue";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Labor Identification Code" } });

        const input = screen.getByLabelText("Labor Identification Code") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Labor Identification Code" } });

        const input = screen.getByLabelText("Labor Identification Code");
        expect(input.getAttribute("class")).toContain("argentina-codigo-unico-de-identificacion-laboral-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Labor Identification Code" } });

        const input = screen.getByLabelText("Labor Identification Code");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Labor Identification Code" } });

        const input = screen.getByLabelText("Labor Identification Code") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Labor Identification Code", required: true } });

        const input = screen.getByLabelText("Labor Identification Code") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Labor Identification Code" } });

        const input = screen.getByLabelText("Labor Identification Code") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Labor Identification Code", disabled: true } });

        const input = screen.getByLabelText("Labor Identification Code") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Labor Identification Code", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
