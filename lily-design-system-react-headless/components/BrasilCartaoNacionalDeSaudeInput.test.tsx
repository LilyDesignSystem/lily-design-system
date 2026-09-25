import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BrasilCartaoNacionalDeSaudeInput";

describe("BrasilCartaoNacionalDeSaudeInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" />);

        const input = screen.getByLabelText("Cartão Nacional de Saúde (CNS)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" />);

        const input = screen.getByLabelText("Cartão Nacional de Saúde (CNS)");
        expect(input.getAttribute("class")).toContain("brasil-cartao-nacional-de-saude-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" />);

        const input = screen.getByLabelText("Cartão Nacional de Saúde (CNS)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" />);

        const input = screen.getByLabelText("Cartão Nacional de Saúde (CNS)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" required />);

        const input = screen.getByLabelText("Cartão Nacional de Saúde (CNS)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" />);

        const input = screen.getByLabelText("Cartão Nacional de Saúde (CNS)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" disabled />);

        const input = screen.getByLabelText("Cartão Nacional de Saúde (CNS)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Cartão Nacional de Saúde (CNS)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
