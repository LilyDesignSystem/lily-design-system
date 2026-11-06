import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ZhongguoJuminShenfenzhengHaomaView";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Resident Identity Card Number (居民身份证号码)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Resident Identity Card Number (居民身份证号码)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Resident Identity Card Number (居民身份证号码)" />);

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Resident Identity Card Number (居民身份证号码)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
