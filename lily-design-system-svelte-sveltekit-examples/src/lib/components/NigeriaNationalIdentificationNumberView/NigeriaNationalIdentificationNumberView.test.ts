import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NigeriaNationalIdentificationNumberView.svelte";

describe("NigeriaNationalIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Identification Number (NIN)", value: "test-value" },
        });

        const el = screen.getByLabelText("National Identification Number (NIN)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nigeria-national-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Identification Number (NIN)", value: "test-value" },
        });

        const el = screen.getByLabelText("National Identification Number (NIN)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identification Number (NIN)" } });

        const el = screen.getByLabelText("National Identification Number (NIN)");
        expect(el.getAttribute("aria-label")).toBe("National Identification Number (NIN)");
    });
});
