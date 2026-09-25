import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MexicoClaveUnicaDeRegistroDePoblacionInput.vue";

describe("MexicoClaveUnicaDeRegistroDePoblacionInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion" } });

        const input = screen.getByLabelText("Mexico Clave Unica De Registro De Poblacion") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion" } });

        const input = screen.getByLabelText("Mexico Clave Unica De Registro De Poblacion");
        expect(input.getAttribute("class")).toContain("mexico-clave-unica-de-registro-de-poblacion-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion" } });

        const input = screen.getByLabelText("Mexico Clave Unica De Registro De Poblacion");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion" } });

        const input = screen.getByLabelText("Mexico Clave Unica De Registro De Poblacion") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion", required: true } });

        const input = screen.getByLabelText("Mexico Clave Unica De Registro De Poblacion") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion" } });

        const input = screen.getByLabelText("Mexico Clave Unica De Registro De Poblacion") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion", disabled: true } });

        const input = screen.getByLabelText("Mexico Clave Unica De Registro De Poblacion") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
