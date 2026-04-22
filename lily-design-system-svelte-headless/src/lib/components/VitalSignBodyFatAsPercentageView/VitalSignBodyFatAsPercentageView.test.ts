import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBodyFatAsPercentageView.svelte";

describe("VitalSignBodyFatAsPercentageView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 22.5, label: "22.5 percent body fat" } });
        expect(screen.getByRole("img", { name: "22.5 percent body fat" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 22.5, label: "22.5 percent body fat" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("22.5 percent body fat");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 22.5, label: "22.5 percent body fat" } });
        expect(screen.getByRole("img").textContent).toBe("22.5");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 35.0, label: "35.0 percent body fat" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("35");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 22.5, label: "BFP", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
