import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./HongKongIdentityCardView.svelte";

describe("HongKongIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Hong Kong Identity Card Number", value: "test-value" },
        });

        const el = screen.getByLabelText("Hong Kong Identity Card Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hong-kong-identity-card-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Hong Kong Identity Card Number", value: "test-value" },
        });

        const el = screen.getByLabelText("Hong Kong Identity Card Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Hong Kong Identity Card Number" } });

        const el = screen.getByLabelText("Hong Kong Identity Card Number");
        expect(el.getAttribute("aria-label")).toBe("Hong Kong Identity Card Number");
    });
});
