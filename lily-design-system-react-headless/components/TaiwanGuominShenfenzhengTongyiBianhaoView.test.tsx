import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TaiwanGuominShenfenzhengTongyiBianhaoView";

describe("TaiwanGuominShenfenzhengTongyiBianhaoView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="National Identification Card Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("National Identification Card Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "taiwan-guomin-shenfenzheng-tongyi-bianhao-view",
        );
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="National Identification Card Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("National Identification Card Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Identification Card Number" />);

        const el = screen.getByLabelText("National Identification Card Number");
        expect(el.getAttribute("aria-label")).toBe("National Identification Card Number");
    });
});
