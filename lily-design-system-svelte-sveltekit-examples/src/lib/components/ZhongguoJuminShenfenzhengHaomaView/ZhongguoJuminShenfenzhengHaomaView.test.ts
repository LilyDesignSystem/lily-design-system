import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ZhongguoJuminShenfenzhengHaomaView.svelte";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)", value: "test-value" } });

        const el = screen.getByLabelText("居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)", value: "test-value" } });

        const el = screen.getByLabelText("居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)" } });

        const el = screen.getByLabelText("居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)");
        expect(el.getAttribute("aria-label")).toBe("居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)");
    });
});
