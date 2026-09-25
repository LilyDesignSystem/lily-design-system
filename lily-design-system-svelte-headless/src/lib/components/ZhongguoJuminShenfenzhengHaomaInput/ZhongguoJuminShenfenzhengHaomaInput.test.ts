import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ZhongguoJuminShenfenzhengHaomaInput from "./ZhongguoJuminShenfenzhengHaomaInput.svelte";

describe("ZhongguoJuminShenfenzhengHaomaInput", () => {
    test("renders with content", () => {
        render(ZhongguoJuminShenfenzhengHaomaInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-input");
    });
});
