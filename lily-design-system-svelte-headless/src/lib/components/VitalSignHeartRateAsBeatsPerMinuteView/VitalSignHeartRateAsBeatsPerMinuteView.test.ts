import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignHeartRateAsBeatsPerMinuteView.svelte";

describe("VitalSignHeartRateAsBeatsPerMinuteView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 72, label: "Heart rate: 72 bpm" } });
        expect(screen.getByRole("img", { name: "Heart rate: 72 bpm" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 72, label: "Heart rate: 72 bpm" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Heart rate: 72 bpm");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 72, label: "Heart rate: 72 bpm" } });
        expect(screen.getByRole("img").textContent).toBe("72");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 110, label: "Heart rate: 110 bpm" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("110");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 72, label: "P", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
