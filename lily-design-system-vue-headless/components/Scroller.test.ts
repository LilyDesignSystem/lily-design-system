import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Scroller.vue";

describe("Scroller", () => {
    test("renders a div with class scroller", () => {
        const { container } = render(Subject, {
            slots: { default: "<section>step</section>", background: "<div>BG</div>" },
        });
        const root = container.querySelector(".scroller");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, {
            props: { label: "Story" },
            slots: { default: "<section>step</section>", background: "<div />" },
        });
        expect(container.querySelector(".scroller")?.getAttribute("aria-label")).toBe("Story");
    });

    test("renders background slot inside scroller-background with aria-live=polite", () => {
        const { container } = render(Subject, {
            slots: { default: "<section>step</section>", background: "<div>BG</div>" },
        });
        const bg = container.querySelector(".scroller-background");
        expect(bg).toBeTruthy();
        expect(bg?.getAttribute("aria-live")).toBe("polite");
        expect(bg?.textContent).toBe("BG");
    });

    test("renders default slot inside the foreground", () => {
        const { container } = render(Subject, {
            slots: { default: "<section>step 1</section><section>step 2</section>", background: "<div />" },
        });
        const fg = container.querySelector(".scroller-foreground");
        expect(fg).toBeTruthy();
        expect(fg?.children.length).toBe(2);
    });

    test("foreground is a ScrollerBase (has scroller-base class)", () => {
        const { container } = render(Subject, {
            slots: { default: "<section>step</section>", background: "<div />" },
        });
        const fg = container.querySelector(".scroller-foreground");
        expect(fg?.classList.contains("scroller-base")).toBe(true);
    });
});
