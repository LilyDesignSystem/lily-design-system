import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ItyopyaFaydaIdentificationNumberInput.svelte";

describe("ItyopyaFaydaIdentificationNumberInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Fayda Identification Number (FIN)" } });

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Fayda Identification Number (FIN)" } });

        const input = screen.getByLabelText("Fayda Identification Number (FIN)");
        expect(input.getAttribute("class")).toContain("ityopya-fayda-identification-number-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Fayda Identification Number (FIN)" } });

        const input = screen.getByLabelText("Fayda Identification Number (FIN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Fayda Identification Number (FIN)" } });

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, {
            props: { label: "Fayda Identification Number (FIN)", required: true },
        });

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Fayda Identification Number (FIN)" } });

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, {
            props: { label: "Fayda Identification Number (FIN)", disabled: true },
        });

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Fayda Identification Number (FIN)", "data-testid": "subject" },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
