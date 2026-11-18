import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./QazaqstanZhekeSaikestendiruNomiriInput";

describe("QazaqstanZhekeSaikestendiruNomiriInput", () => {
    test("renders a text input", () => {
        render(() => <Subject label="Individual Identification Number (IIN)" />);

        const input = screen.getByLabelText(
            "Individual Identification Number (IIN)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(() => <Subject label="Individual Identification Number (IIN)" />);

        const input = screen.getByLabelText("Individual Identification Number (IIN)");
        expect(input.getAttribute("class")).toContain("qazaqstan-zheke-saikestendiru-nomiri-input");
    });

    test("has autocomplete off", () => {
        render(() => <Subject label="Individual Identification Number (IIN)" />);

        const input = screen.getByLabelText("Individual Identification Number (IIN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(() => <Subject label="Individual Identification Number (IIN)" />);

        const input = screen.getByLabelText(
            "Individual Identification Number (IIN)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(() => (
            <Subject
                label="Individual Identification Number (IIN)"
                required
            />
        ));

        const input = screen.getByLabelText(
            "Individual Identification Number (IIN)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(() => <Subject label="Individual Identification Number (IIN)" />);

        const input = screen.getByLabelText(
            "Individual Identification Number (IIN)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(() => (
            <Subject
                label="Individual Identification Number (IIN)"
                disabled
            />
        ));

        const input = screen.getByLabelText(
            "Individual Identification Number (IIN)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(() => (
            <Subject
                label="Individual Identification Number (IIN)"
                data-testid="subject"
            />
        ));

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
