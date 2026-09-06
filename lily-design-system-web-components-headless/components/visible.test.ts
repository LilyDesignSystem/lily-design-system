import { afterEach, describe, expect, test, vi } from "vitest";

import { Visible } from "./visible.js";

if (!customElements.get("lily-visible")) {
    customElements.define("lily-visible", Visible);
}

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

type IntersectionCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

class FakeIntersectionObserver {
    static instances: FakeIntersectionObserver[] = [];
    static lastOptions: IntersectionObserverInit | undefined;
    callback: IntersectionCallback;
    observed: Element | null = null;
    disconnected = false;

    constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        FakeIntersectionObserver.instances.push(this);
        FakeIntersectionObserver.lastOptions = options;
    }

    observe(target: Element): void {
        this.observed = target;
    }

    disconnect(): void {
        this.disconnected = true;
    }

    trigger(isIntersecting: boolean): void {
        this.callback([{ isIntersecting, target: this.observed as Element }]);
    }
}

describe("Visible", () => {
    test("carries the base class and starts data-visible=false", () => {
        const host = render("<lily-visible>Content</lily-visible>");

        expect(host.classList.contains("visible")).toBe(true);
        expect(host.getAttribute("data-visible")).toBe("false");
    });

    test("intersection sets data-visible=true and fires lily-visibility-change", () => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
        FakeIntersectionObserver.instances = [];

        const host = render("<lily-visible>Content</lily-visible>") as unknown as Visible;
        const handler = vi.fn();
        host.addEventListener("lily-visibility-change", handler);
        const observer = FakeIntersectionObserver.instances.at(-1)!;

        observer.trigger(true);

        expect(host.getAttribute("data-visible")).toBe("true");
        expect(host.visible).toBe(true);
        expect(handler).toHaveBeenCalledTimes(1);
        expect((handler.mock.calls[0][0] as CustomEvent<{ visible: boolean }>).detail).toEqual({ visible: true });
    });

    test("scrolling back out sets data-visible=false again", () => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
        FakeIntersectionObserver.instances = [];

        const host = render("<lily-visible>Content</lily-visible>") as unknown as Visible;
        const observer = FakeIntersectionObserver.instances.at(-1)!;

        observer.trigger(true);
        observer.trigger(false);

        expect(host.getAttribute("data-visible")).toBe("false");
        expect(host.visible).toBe(false);
    });

    test("once disconnects the observer after the first intersection", () => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
        FakeIntersectionObserver.instances = [];

        render("<lily-visible once>Content</lily-visible>");
        const observer = FakeIntersectionObserver.instances.at(-1)!;

        observer.trigger(true);

        expect(observer.disconnected).toBe(true);
    });

    test("threshold and root-margin are passed to the observer", () => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
        FakeIntersectionObserver.instances = [];

        render('<lily-visible threshold="0.5" root-margin="10px">Content</lily-visible>');

        expect(FakeIntersectionObserver.lastOptions).toEqual({ threshold: 0.5, rootMargin: "10px" });
    });

    test("does not fire the change event when intersecting state is unchanged", () => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
        FakeIntersectionObserver.instances = [];

        const host = render("<lily-visible>Content</lily-visible>") as unknown as Visible;
        const handler = vi.fn();
        host.addEventListener("lily-visibility-change", handler);
        const observer = FakeIntersectionObserver.instances.at(-1)!;

        observer.trigger(false);

        expect(handler).not.toHaveBeenCalled();
    });
});
