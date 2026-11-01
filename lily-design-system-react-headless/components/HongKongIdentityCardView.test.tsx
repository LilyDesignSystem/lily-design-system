import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./HongKongIdentityCardView";

describe("HongKongIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Hong Kong Identity Card Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Hong Kong Identity Card Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hong-kong-identity-card-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Hong Kong Identity Card Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Hong Kong Identity Card Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Hong Kong Identity Card Number" />);

        const el = screen.getByLabelText("Hong Kong Identity Card Number");
        expect(el.getAttribute("aria-label")).toBe("Hong Kong Identity Card Number");
    });
});
