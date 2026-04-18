import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignHeartRateAsBeatsPerMinuteInput.svelte";

describe("VitalSignHeartRateAsBeatsPerMinuteInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Heart rate (bpm)" } });
        expect((screen.getByLabelText("Heart rate (bpm)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Heart rate (bpm)" } });
        expect(screen.getByLabelText("Heart rate (bpm)")).toBeTruthy();
    });

    test("has default min=0, max=300, step=1", () => {
        render(Subject, { props: { label: "Heart rate" } });
        const input = screen.getByLabelText("Heart rate") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("300");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Heart rate", disabled: true } });
        expect((screen.getByLabelText("Heart rate") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Heart rate", required: true } });
        expect((screen.getByLabelText("Heart rate") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Heart rate", "data-testid": "pr" } });
        expect(screen.getByTestId("pr")).toBeTruthy();
    });
});
