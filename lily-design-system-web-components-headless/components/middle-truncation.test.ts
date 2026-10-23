import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { MiddleTruncation } from "./middle-truncation.js";

if (!customElements.get("lily-middle-truncation")) {
    customElements.define("lily-middle-truncation", MiddleTruncation);
}

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
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

const text = "abcdefghijklmnopqrstuvwxyz";

function render(attrs: string): HTMLElement {
    document.body.innerHTML = `<lily-middle-truncation ${attrs}></lily-middle-truncation>`;
    return document.body.firstElementChild as HTMLElement;
}
const visual = (h: HTMLElement) => h.querySelector(".middle-truncation-visual")!.textContent;

describe("MiddleTruncation", () => {
    test("renders a <span> with the base class first, then the host's class", () => {
        const host = render(`text="${text}" ellipsis="…" class="mine"`);
        expect(host.querySelector("span.middle-truncation")!.getAttribute("class")).toBe("middle-truncation mine");
    });

    test("shortens the visual text to the measured width", () => {
        expect(visual(render(`text="${text}" ellipsis="…"`))).toBe("abc…wxyz");
    });

    test("keeps the full text in the accessibility tree and hides the shortened copy from it", () => {
        const host = render(`text="${text}" ellipsis="…"`);
        expect(host.querySelector(".middle-truncation-visual")!.getAttribute("aria-hidden")).toBe("true");
        const full = host.querySelector(".middle-truncation-full")!;
        expect(full.textContent).toBe(text);
        expect(full.closest("[aria-hidden]")).toBeNull();
    });

    test("shows the full text when it fits, and sets no data-truncated", () => {
        width = 100;
        const host = render(`text="${text}" ellipsis="…"`);
        expect(visual(host)).toBe(text);
        expect(host.querySelector(".middle-truncation")!.hasAttribute("data-truncated")).toBe(false);
    });

    test("sets data-truncated and data-strategy", () => {
        const host = render(`text="${text}" ellipsis="…" strategy="fixed-end" end="4"`);
        const root = host.querySelector(".middle-truncation")!;
        expect(root.hasAttribute("data-truncated")).toBe(true);
        expect(root.getAttribute("data-strategy")).toBe("fixed-end");
    });

    test("uses the consumer's ellipsis, with no default of its own", () => {
        expect(visual(render(`text="${text}" ellipsis="[...]"`))).toBe("a[...]yz");
    });

    test("keeps `end` characters at the end for fixed-end", () => {
        width = 12;
        expect(visual(render(`text="${text}" ellipsis="…" strategy="fixed-end" end="4"`))).toBe("abcdefg…wxyz");
    });

    test("re-measures when the container resizes, changing only the visual string", () => {
        const host = render(`text="${text}" ellipsis="…"`);
        expect(visual(host)).toBe("abc…wxyz");
        width = 12;
        observers.forEach((cb) => cb());
        expect(visual(host)).toBe("abcde…uvwxyz");
        expect(host.querySelector(".middle-truncation-full")!.textContent).toBe(text);
    });

    test("re-renders when the text attribute changes", () => {
        const host = render(`text="${text}" ellipsis="…"`);
        host.setAttribute("text", "short");
        expect(visual(host)).toBe("short");
        expect(host.querySelector(".middle-truncation-full")!.textContent).toBe("short");
    });

    test("shows the full text when there is no layout width", () => {
        width = 0;
        expect(visual(render(`text="${text}" ellipsis="…"`))).toBe(text);
    });

    test("passes other attributes to the inner span", () => {
        const host = render(`text="${text}" ellipsis="…" data-testid="mt" id="x"`);
        const root = host.querySelector("span.middle-truncation")!;
        expect(root.getAttribute("data-testid")).toBe("mt");
        expect(root.id).toBe("x");
    });
});
