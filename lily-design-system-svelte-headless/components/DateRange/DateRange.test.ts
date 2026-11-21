import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DateRange.svelte";

describe("DateRange", () => {
    test("renders two date inputs", () => {
        render(Subject, { props: { label: "Dates", startLabel: "Start", endLabel: "End" } });
        expect(screen.getByLabelText("Start")).toBeTruthy();
        expect(screen.getByLabelText("End")).toBeTruthy();
    });

    test("has group aria-label", () => {
        render(Subject, { props: { label: "Trip dates", startLabel: "From", endLabel: "To" } });
        expect(screen.getByLabelText("Trip dates").tagName).toBe("FIELDSET");
    });

    test("both are date type inputs", () => {
        render(Subject, { props: { label: "Dates", startLabel: "Start", endLabel: "End" } });
        expect((screen.getByLabelText("Start") as HTMLInputElement).type).toBe("date");
        expect((screen.getByLabelText("End") as HTMLInputElement).type).toBe("date");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "D", startLabel: "S", endLabel: "E", "data-testid": "dr" },
        });
        expect(screen.getByTestId("dr")).toBeTruthy();
    });

    test("typing a date writes it back to the bound start and end", async () => {
        const bound = { start: "", end: "" };
        render(Subject, {
            props: {
                label: "Trip dates",
                startLabel: "From",
                endLabel: "To",
                get start() {
                    return bound.start;
                },
                set start(v: string) {
                    bound.start = v;
                },
                get end() {
                    return bound.end;
                },
                set end(v: string) {
                    bound.end = v;
                },
            },
        });
        await fireEvent.input(screen.getByLabelText("From"), { target: { value: "2026-11-21" } });
        await fireEvent.input(screen.getByLabelText("To"), { target: { value: "2026-11-28" } });
        expect(bound).toEqual({ start: "2026-11-21", end: "2026-11-28" });
    });
});
