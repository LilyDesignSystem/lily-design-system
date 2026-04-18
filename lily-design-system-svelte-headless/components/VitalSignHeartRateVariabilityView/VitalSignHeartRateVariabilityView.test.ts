import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignHeartRateVariabilityView.svelte";

describe("VitalSignHeartRateVariabilityView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 45, label: "45 milliseconds HRV" } });
        expect(screen.getByRole("img", { name: "45 milliseconds HRV" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 45, label: "45 milliseconds HRV" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("45 milliseconds HRV");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 45, label: "45 milliseconds HRV" } });
        expect(screen.getByRole("img").textContent).toBe("45");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 120, label: "120 milliseconds HRV" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("120");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 45, label: "P", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
