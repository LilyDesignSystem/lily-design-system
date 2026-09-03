import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ClipboardCopyButton } from "./clipboard-copy-button.js";

if (!customElements.get("lily-clipboard-copy-button")) {
    customElements.define("lily-clipboard-copy-button", ClipboardCopyButton);
}

function flush(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
    });
});

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ClipboardCopyButton", () => {
    test("starts with data-copied=false", () => {
        const host = render('<lily-clipboard-copy-button text="hi" label="Copy"></lily-clipboard-copy-button>');

        expect(host.querySelector("button")!.getAttribute("data-copied")).toBe("false");
    });

    test("copies text via navigator.clipboard.writeText and sets data-copied=true", async () => {
        const host = render('<lily-clipboard-copy-button text="hello" label="Copy"></lily-clipboard-copy-button>');
        const button = host.querySelector("button") as HTMLButtonElement;

        button.click();
        await flush();

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
        expect(button.getAttribute("data-copied")).toBe("true");
    });

    test("dispatches lily-success after a successful copy", async () => {
        const host = render('<lily-clipboard-copy-button text="hello" label="Copy"></lily-clipboard-copy-button>');
        const button = host.querySelector("button") as HTMLButtonElement;
        const handler = vi.fn();
        host.addEventListener("lily-success", handler);

        button.click();
        await flush();

        expect(handler).toHaveBeenCalled();
    });

    test("resets data-copied back to false after 2 seconds", async () => {
        vi.useFakeTimers();
        try {
            const host = render('<lily-clipboard-copy-button text="hello" label="Copy"></lily-clipboard-copy-button>');
            const button = host.querySelector("button") as HTMLButtonElement;

            button.click();
            await vi.advanceTimersByTimeAsync(0);
            expect(button.getAttribute("data-copied")).toBe("true");

            await vi.advanceTimersByTimeAsync(2000);
            expect(button.getAttribute("data-copied")).toBe("false");
        } finally {
            vi.useRealTimers();
        }
    });

    test("dispatches lily-error when the copy rejects", async () => {
        Object.defineProperty(navigator, "clipboard", {
            value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
            configurable: true,
        });
        const host = render('<lily-clipboard-copy-button text="hello" label="Copy"></lily-clipboard-copy-button>');
        const button = host.querySelector("button") as HTMLButtonElement;
        const handler = vi.fn();
        host.addEventListener("lily-error", handler);

        button.click();
        await flush();

        expect(handler).toHaveBeenCalled();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-clipboard-copy-button text="hi" label="Copy link"></lily-clipboard-copy-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Copy link");
    });
});
