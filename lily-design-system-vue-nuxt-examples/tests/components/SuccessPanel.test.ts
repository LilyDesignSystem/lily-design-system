import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SuccessPanel from "../../components/SuccessPanel.vue";

describe("SuccessPanel", () => {
    it("renders with class", () => {
        const { container } = render(SuccessPanel, {
            props: { label: "Test" },
            slots: { default: "content" },
        });
        const el = container.querySelector(".success-panel");
        expect(el).toBeTruthy();
    });

    it("has role=status with its label", () => {
        const { container } = render(SuccessPanel, {
            props: { label: "Story" },
            slots: { default: "content" },
        });
        const root = container.querySelector(".success-panel");
        expect(root?.getAttribute("role")).toBe("status");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });
});
