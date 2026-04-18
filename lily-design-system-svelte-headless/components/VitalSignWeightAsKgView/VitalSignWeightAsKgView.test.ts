import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignWeightAsKgView.svelte";

describe("VitalSignWeightAsKgView", () => {
    test("renders span with img role", () => {
        render(Subject, { props: { value: 75, label: "75 kg weight" } });
        expect(screen.getByRole("img", { name: "75 kg weight" })).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { value: 75, label: "75 kg weight" } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("75 kg weight");
    });

    test("displays value as text content", () => {
        render(Subject, { props: { value: 75, label: "75 kg weight" } });
        expect(screen.getByRole("img").textContent).toBe("75");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 75, label: "75 kg weight" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("75");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 75, label: "P", "data-testid": "vs" } });
        expect(screen.getByTestId("vs")).toBeTruthy();
    });
});
