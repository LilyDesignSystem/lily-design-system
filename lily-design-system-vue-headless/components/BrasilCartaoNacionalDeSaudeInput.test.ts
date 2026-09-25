import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BrasilCartaoNacionalDeSaudeInput.vue";

describe("BrasilCartaoNacionalDeSaudeInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude" } });

        const input = screen.getByLabelText("Brasil Cartao Nacional De Saude") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude" } });

        const input = screen.getByLabelText("Brasil Cartao Nacional De Saude");
        expect(input.getAttribute("class")).toContain("brasil-cartao-nacional-de-saude-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude" } });

        const input = screen.getByLabelText("Brasil Cartao Nacional De Saude");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude" } });

        const input = screen.getByLabelText("Brasil Cartao Nacional De Saude") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude", required: true } });

        const input = screen.getByLabelText("Brasil Cartao Nacional De Saude") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude" } });

        const input = screen.getByLabelText("Brasil Cartao Nacional De Saude") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude", disabled: true } });

        const input = screen.getByLabelText("Brasil Cartao Nacional De Saude") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
