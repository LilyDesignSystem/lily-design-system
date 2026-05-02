import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./HeroHeadline.vue";

describe("HeroHeadline", () => {
    test("renders a div with class hero-headline", () => {
        const { container } = render(Subject, { props: { label: "x" }, slots: { default: "HEADLINE", media: "<div>MEDIA</div>" } });
        const root = container.querySelector(".hero-headline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: { label: "x" }, slots: { default: "HEADLINE", media: "<div>MEDIA</div>" } });
        expect(container.textContent).toContain("HEADLINE");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "HEADLINE", media: "<div>MEDIA</div>" } });
        const root = container.querySelector(".hero-headline");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("renders the media slot", () => {
        const { container } = render(Subject, { props: { label: "x" }, slots: { default: "HEADLINE", media: "<div>MEDIA</div>" } });
        expect(container.textContent).toContain("MEDIA");
        expect(container.textContent).toContain("HEADLINE");
    });
});
