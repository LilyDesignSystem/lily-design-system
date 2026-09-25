import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ZhongguoJuminShenfenzhengHaomaView from "./ZhongguoJuminShenfenzhengHaomaView.svelte";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders with content", () => {
        render(ZhongguoJuminShenfenzhengHaomaView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-view");
    });
});
