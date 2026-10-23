import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/vue";
import { nextTick } from "vue";

import Subject from "./MiddleTruncation.vue";

// jsdom has no layout and no canvas: stub a width and a monospace metric (one unit per character).
let width = 8;
let observers: Array<() => void> = [];

beforeEach(() => {
    width = 8;
    observers = [];
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((() => ({
        font: "",
        measureText: (s: string) => ({ width: [...s].length }),
    })) as never);
    vi.stubGlobal(
        "ResizeObserver",
        class {
            constructor(cb: () => void) {
                observers.push(cb);
            }
            observe() {}
            disconnect() {}
        },
    );
    vi.stubGlobal("requestAnimationFrame", (cb: () => void) => {
        cb();
        return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

const text = "abcdefghijklmnopqrstuvwxyz";
const visual = (c: HTMLElement) => c.querySelector(".middle-truncation-visual")!.textContent;

describe("MiddleTruncation", () => {
    test("renders a <span> with the base class first, then the consumer class", async () => {
        const { container } = render(Subject, { props: { text, ellipsis: "…" }, attrs: { class: "mine" } });
        await nextTick();
        expect(container.querySelector("span.middle-truncation")!.getAttribute("class")).toBe("middle-truncation mine");
    });

    test("shortens the visual text to the measured width", async () => {
        const { container } = render(Subject, { props: { text, ellipsis: "…" } });
        await nextTick();
        expect(visual(container)).toBe("abc…wxyz");
    });

    test("keeps the full text in the accessibility tree and hides the shortened copy from it", async () => {
        const { container } = render(Subject, { props: { text, ellipsis: "…" } });
        await nextTick();
        expect(container.querySelector(".middle-truncation-visual")!.getAttribute("aria-hidden")).toBe("true");
        const full = container.querySelector(".middle-truncation-full")!;
        expect(full.textContent).toBe(text);
        expect(full.closest("[aria-hidden]")).toBeNull();
    });

    test("shows the full text when it fits, and sets no data-truncated", async () => {
        width = 100;
        const { container } = render(Subject, { props: { text, ellipsis: "…" } });
        await nextTick();
        expect(visual(container)).toBe(text);
        expect(container.querySelector(".middle-truncation")!.hasAttribute("data-truncated")).toBe(false);
    });

    test("sets data-truncated and data-strategy", async () => {
        const { container } = render(Subject, { props: { text, ellipsis: "…", strategy: "fixed-end", end: 4 } });
        await nextTick();
        const root = container.querySelector(".middle-truncation")!;
        expect(root.hasAttribute("data-truncated")).toBe(true);
        expect(root.getAttribute("data-strategy")).toBe("fixed-end");
    });

    test("uses the consumer's ellipsis, with no default of its own", async () => {
        const { container } = render(Subject, { props: { text, ellipsis: "[...]" } });
        await nextTick();
        expect(visual(container)).toBe("a[...]yz");
    });

    test("keeps `end` characters at the end for fixed-end", async () => {
        width = 12;
        const { container } = render(Subject, { props: { text, ellipsis: "…", strategy: "fixed-end", end: 4 } });
        await nextTick();
        expect(visual(container)).toBe("abcdefg…wxyz");
    });

    test("re-measures when the container resizes, changing only the visual string", async () => {
        const { container } = render(Subject, { props: { text, ellipsis: "…" } });
        await nextTick();
        expect(visual(container)).toBe("abc…wxyz");
        width = 12;
        observers.forEach((cb) => cb());
        await nextTick();
        expect(visual(container)).toBe("abcde…uvwxyz");
        expect(container.querySelector(".middle-truncation-full")!.textContent).toBe(text);
    });

    test("shows the full text when there is no layout width", async () => {
        width = 0;
        const { container } = render(Subject, { props: { text, ellipsis: "…" } });
        await nextTick();
        expect(visual(container)).toBe(text);
    });

    test("passes attrs to the root", async () => {
        const { container } = render(Subject, { props: { text, ellipsis: "…" }, attrs: { "data-testid": "mt", id: "x" } });
        await nextTick();
        const root = container.querySelector("span.middle-truncation")!;
        expect(root.getAttribute("data-testid")).toBe("mt");
        expect(root.id).toBe("x");
    });
});
