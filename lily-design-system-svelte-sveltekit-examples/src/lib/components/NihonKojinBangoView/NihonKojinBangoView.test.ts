import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NihonKojinBangoView.svelte";

describe("NihonKojinBangoView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Individual Number / My Number (マイナンバー)", value: "test-value" } });

        const el = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nihon-kojin-bango-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Individual Number / My Number (マイナンバー)", value: "test-value" } });

        const el = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Individual Number / My Number (マイナンバー)" } });

        const el = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(el.getAttribute("aria-label")).toBe("Individual Number / My Number (マイナンバー)");
    });
});
