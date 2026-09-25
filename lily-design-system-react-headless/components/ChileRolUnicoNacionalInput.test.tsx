import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ChileRolUnicoNacionalInput";

describe("ChileRolUnicoNacionalInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Rol Único Nacional (RUN)" />);

        const input = screen.getByLabelText("Rol Único Nacional (RUN)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Rol Único Nacional (RUN)" />);

        const input = screen.getByLabelText("Rol Único Nacional (RUN)");
        expect(input.getAttribute("class")).toContain("chile-rol-unico-nacional-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Rol Único Nacional (RUN)" />);

        const input = screen.getByLabelText("Rol Único Nacional (RUN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Rol Único Nacional (RUN)" />);

        const input = screen.getByLabelText("Rol Único Nacional (RUN)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Rol Único Nacional (RUN)" required />);

        const input = screen.getByLabelText("Rol Único Nacional (RUN)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Rol Único Nacional (RUN)" />);

        const input = screen.getByLabelText("Rol Único Nacional (RUN)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Rol Único Nacional (RUN)" disabled />);

        const input = screen.getByLabelText("Rol Único Nacional (RUN)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Rol Único Nacional (RUN)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
