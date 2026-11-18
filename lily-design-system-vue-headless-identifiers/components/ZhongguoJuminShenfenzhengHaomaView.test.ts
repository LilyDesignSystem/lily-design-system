import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ZhongguoJuminShenfenzhengHaomaView.vue";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Resident Identity Card Number", value: "test-value" } });

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Resident Identity Card Number", value: "test-value" } });

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Resident Identity Card Number" } });

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Resident Identity Card Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
