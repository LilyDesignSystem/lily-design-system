import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";

import Subject from "./DialGroup.vue";

describe("DialGroup", () => {
    test("renders a div with class dial-group", () => {
        const { container } = render(Subject, {
            props: { label: "Audio" },
            slots: { default: "dials" },
        });
        const root = container.querySelector(".dial-group");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=group with aria-label", () => {
        render(Subject, {
            props: { label: "Audio settings" },
            slots: { default: "dials" },
        });
        const group = screen.getByRole("group", { name: "Audio settings" });
        expect(group).toBeTruthy();
    });

    test("renders children content", () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "dial-1 dial-2" },
        });
        expect(container.textContent).toBe("dial-1 dial-2");
    });
});
