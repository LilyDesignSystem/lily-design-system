import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Byline.vue";

describe("Byline", () => {
    test("renders a div with class byline", () => {
        const { container } = render(Subject, { slots: { default: "Jane Smith" } });
        const root = container.querySelector(".byline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders the authors default slot", () => {
        const { container } = render(Subject, { slots: { default: "Jane Smith" } });
        expect(container.querySelector(".byline-authors")?.textContent).toBe("Jane Smith");
    });

    test("renders the published slot when provided", () => {
        const { container } = render(Subject, {
            slots: {
                default: "Jane Smith",
                published: '<time datetime="2026-04-15">April 15, 2026</time>',
            },
        });
        const pub = container.querySelector(".byline-published time");
        expect(pub?.getAttribute("datetime")).toBe("2026-04-15");
    });

    test("omits published slot when not provided", () => {
        const { container } = render(Subject, { slots: { default: "Jane" } });
        expect(container.querySelector(".byline-published")).toBeNull();
    });

    test("renders the updated slot when provided", () => {
        const { container } = render(Subject, {
            slots: {
                default: "Jane",
                updated: '<time datetime="2026-04-16">April 16</time>',
            },
        });
        expect(container.querySelector(".byline-updated time")?.getAttribute("datetime")).toBe("2026-04-16");
    });
});
