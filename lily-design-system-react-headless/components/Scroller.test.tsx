import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Scroller";

describe("Scroller", () => {
    test("renders a div with class scroller", () => {
        const { container } = render(
            <Subject background={<div>BG</div>}>
                <section>step</section>
            </Subject>
        );
        const root = container.querySelector(".scroller");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(
            <Subject label="Story" background={<div />}>
                <section>step</section>
            </Subject>
        );
        expect(container.querySelector(".scroller")?.getAttribute("aria-label")).toBe("Story");
    });

    test("renders background inside scroller-background with aria-live=polite", () => {
        const { container } = render(
            <Subject background={<div>BG</div>}>
                <section>step</section>
            </Subject>
        );
        const bg = container.querySelector(".scroller-background");
        expect(bg).toBeTruthy();
        expect(bg?.getAttribute("aria-live")).toBe("polite");
        expect(bg?.textContent).toBe("BG");
    });

    test("renders children inside the foreground", () => {
        const { container } = render(
            <Subject background={<div />}>
                <section>step 1</section>
                <section>step 2</section>
            </Subject>
        );
        const fg = container.querySelector(".scroller-foreground");
        expect(fg).toBeTruthy();
        expect(fg?.children.length).toBe(2);
    });

    test("foreground is a ScrollerBase (has scroller-base class)", () => {
        const { container } = render(
            <Subject background={<div />}>
                <section>step</section>
            </Subject>
        );
        const fg = container.querySelector(".scroller-foreground");
        expect(fg?.classList.contains("scroller-base")).toBe(true);
    });
});
