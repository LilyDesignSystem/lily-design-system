import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import StatusTag from "../../components/StatusTag.vue";

describe("StatusTag", () => {
    it("renders with class", () => {
        const { container } = render(StatusTag, {
            props: { label: "Test" },
            slots: { default: "content" },
        });
        const el = container.querySelector(".status-tag");
        expect(el).toBeTruthy();
    });

    it("is a static label, with label as hidden text", () => {
        const { container } = render(StatusTag, {
            props: { label: "Status:" },
            slots: { default: "Done" },
        });
        const el = container.querySelector(".status-tag")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.querySelector(".screen-reader-span")!.textContent).toBe("Status: ");
    });

    it("renders type as data-type, default when unset, as Svelte does", () => {
        const plain = render(StatusTag, { slots: { default: "Draft" } });
        expect(plain.container.querySelector(".status-tag")!.getAttribute("data-type")).toBe(
            "default",
        );
        const set = render(StatusTag, { props: { type: "error" }, slots: { default: "Failed" } });
        expect(set.container.querySelector(".status-tag")!.getAttribute("data-type")).toBe("error");
    });
});
