import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Picture.vue";

const parts =
    '<source srcset="wide.webp" media="(min-width: 800px)" type="image/webp"><img src="small.jpg" alt="A lily" width="320" height="200">';

describe("Picture", () => {
    test("renders a <picture> with the base class", () => {
        const { container } = render(Subject, { slots: { default: parts } });
        expect(container.querySelector("picture.picture")).toBeTruthy();
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, { attrs: { class: "mine", id: "x1" }, slots: { default: parts } });
        const el = container.querySelector(".picture")!;
        expect(el.id).toBe("x1");
        expect(el.getAttribute("class")).toBe("picture mine");
    });

    test("renders the source and img slot, keeping the consumer's alt", () => {
        const { container } = render(Subject, { slots: { default: parts } });
        expect(container.querySelector("picture source")!.getAttribute("media")).toBe("(min-width: 800px)");
        expect(container.querySelector("picture img")!.getAttribute("alt")).toBe("A lily");
    });

    test("adds no text of its own", () => {
        const { container } = render(Subject);
        expect(container.querySelector("picture")!.textContent).toBe("");
    });
});
