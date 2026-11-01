import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./WarningText.vue";

const text =
    '<span class="visually-hidden">Warning</span> You can be fined if you do not register.';

describe("WarningText", () => {
    test("renders a <div> with the base class", () => {
        const { container } = render(Subject, { slots: { default: text } });
        expect(container.querySelector("div.warning-text")).toBeTruthy();
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, {
            attrs: { class: "mine", id: "x1" },
            slots: { default: text },
        });
        const el = container.querySelector(".warning-text")!;
        expect(el.id).toBe("x1");
        expect(el.getAttribute("class")).toBe("warning-text mine");
    });

    test("renders the default slot, hidden prefix included, inside strong.warning-text-text", () => {
        const { container } = render(Subject, { slots: { default: text } });
        const strong = container.querySelector(".warning-text > strong.warning-text-text")!;
        expect(strong.querySelector(".visually-hidden")!.textContent).toBe("Warning");
        expect(strong.textContent).toContain("You can be fined");
    });

    test("renders a supplied icon first, inside an aria-hidden wrapper", () => {
        const { container } = render(Subject, { slots: { default: text, icon: "!" } });
        const wrap = container.querySelector(".warning-text > .warning-text-icon")!;
        expect(wrap.getAttribute("aria-hidden")).toBe("true");
        expect(wrap.textContent).toBe("!");
        expect(container.querySelector(".warning-text")!.firstElementChild).toBe(wrap);
    });

    test("renders no icon wrapper when no icon is supplied", () => {
        const { container } = render(Subject, { slots: { default: text } });
        expect(container.querySelector(".warning-text-icon")).toBeNull();
    });

    test("adds no role and no text of its own", () => {
        const { container } = render(Subject);
        const root = container.querySelector(".warning-text")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.textContent).toBe("");
    });
});
