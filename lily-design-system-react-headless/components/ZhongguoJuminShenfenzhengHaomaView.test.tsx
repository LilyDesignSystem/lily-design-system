import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ZhongguoJuminShenfenzhengHaomaView";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Resident Identity Card Number (居民身份证号码)" value="test-value" />);

        const el = screen.getByLabelText("Resident Identity Card Number (居民身份证号码)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Resident Identity Card Number (居民身份证号码)" value="test-value" />);

        const el = screen.getByLabelText("Resident Identity Card Number (居民身份证号码)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Resident Identity Card Number (居民身份证号码)" />);

        const el = screen.getByLabelText("Resident Identity Card Number (居民身份证号码)");
        expect(el.getAttribute("aria-label")).toBe("Resident Identity Card Number (居民身份证号码)");
    });
});
