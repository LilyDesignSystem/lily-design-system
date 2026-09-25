import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./HangukJuminDeungnokBeonhoInput.vue";

describe("HangukJuminDeungnokBeonhoInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho" } });

        const input = screen.getByLabelText("Hanguk Jumin Deungnok Beonho") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho" } });

        const input = screen.getByLabelText("Hanguk Jumin Deungnok Beonho");
        expect(input.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho" } });

        const input = screen.getByLabelText("Hanguk Jumin Deungnok Beonho");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho" } });

        const input = screen.getByLabelText("Hanguk Jumin Deungnok Beonho") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho", required: true } });

        const input = screen.getByLabelText("Hanguk Jumin Deungnok Beonho") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho" } });

        const input = screen.getByLabelText("Hanguk Jumin Deungnok Beonho") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho", disabled: true } });

        const input = screen.getByLabelText("Hanguk Jumin Deungnok Beonho") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
