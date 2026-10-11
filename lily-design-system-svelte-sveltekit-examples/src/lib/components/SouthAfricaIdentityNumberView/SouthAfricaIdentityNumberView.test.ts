import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SouthAfricaIdentityNumberView.svelte";

describe("SouthAfricaIdentityNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "South African Identity Number", value: "test-value" } });

        const el = screen.getByLabelText("South African Identity Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("south-africa-identity-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "South African Identity Number", value: "test-value" } });

        const el = screen.getByLabelText("South African Identity Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "South African Identity Number" } });

        const el = screen.getByLabelText("South African Identity Number");
        expect(el.getAttribute("aria-label")).toBe("South African Identity Number");
    });
});
