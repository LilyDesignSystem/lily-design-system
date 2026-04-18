import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignHeightAsCmView.svelte";

describe("VitalSignHeightAsCmView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 175, label: "175 cm height" } });
        expect(screen.getByRole("img", { name: "175 cm height" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 175, label: "175 cm height" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("175 cm height");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 175, label: "175 cm height" } });
        expect(screen.getByRole("img").textContent).toBe("175");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 175, label: "175 cm height" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("175");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 175, label: "P", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
