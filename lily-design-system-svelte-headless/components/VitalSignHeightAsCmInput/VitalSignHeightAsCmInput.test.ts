import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignHeightAsCmInput.svelte";

describe("VitalSignHeightAsCmInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Height (cm)" } });
        expect((screen.getByLabelText("Height (cm)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Height (cm)" } });
        expect(screen.getByLabelText("Height (cm)")).toBeTruthy();
    });

    test("has default min=0, max=300, step=1", () => {
        render(Subject, { props: { label: "Height" } });
        const input = screen.getByLabelText("Height") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("300");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Height", disabled: true } });
        expect((screen.getByLabelText("Height") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Height", required: true } });
        expect((screen.getByLabelText("Height") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Height", "data-testid": "pr" } });
        expect(screen.getByTestId("pr")).toBeTruthy();
    });
});
