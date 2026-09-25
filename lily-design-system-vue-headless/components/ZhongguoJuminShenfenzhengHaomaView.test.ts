import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ZhongguoJuminShenfenzhengHaomaView.vue";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Resident Identity Card Number", value: "test-value" } });

        const el = screen.getByLabelText("Resident Identity Card Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Resident Identity Card Number", value: "test-value" } });

        const el = screen.getByLabelText("Resident Identity Card Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Resident Identity Card Number" } });

        const el = screen.getByLabelText("Resident Identity Card Number");
        expect(el.getAttribute("aria-label")).toBe("Resident Identity Card Number");
    });
});
