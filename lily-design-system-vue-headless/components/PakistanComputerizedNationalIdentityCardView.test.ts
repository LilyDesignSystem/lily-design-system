import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./PakistanComputerizedNationalIdentityCardView.vue";

describe("PakistanComputerizedNationalIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = screen.getByLabelText("National Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "pakistan-computerized-national-identity-card-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = screen.getByLabelText("National Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identification Number" } });

        const el = screen.getByLabelText("National Identification Number");
        expect(el.getAttribute("aria-label")).toBe("National Identification Number");
    });
});
