import { render, screen } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { act } from "./test-act";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./CharacterCounter";

const root = (container: HTMLElement) => container.querySelector(".character-counter")!;
const visible = (container: HTMLElement) => container.querySelector(".character-counter-text")!;

describe("CharacterCounter", () => {
    afterEach(() => vi.useRealTimers());

    test("renders a span with the base class, a visible count and a status", () => {
        const { container } = render(() => (
            <Subject
                count={5}
                max={280}
            />
        ));
        expect(root(container).tagName).toBe("SPAN");
        expect(root(container).hasAttribute("role")).toBe(false);
        expect(root(container).hasAttribute("aria-live")).toBe(false);
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("displays count only when no max, and count / max with one", () => {
        const [max, set_max] = createSignal<any>(undefined);
        const { container } = render(() => (
            <Subject
                count={42}
                max={max()}
            />
        ));
        expect(visible(container).textContent).toBe("42");
        expect(screen.getByRole("status").textContent).toBe("42");
        set_max(280);
        flush();
        expect(visible(container).textContent).toBe("42 / 280");
    });

    test("the visible count is hidden from assistive technology; the status is what is read", () => {
        const { container } = render(() => <Subject count={1} />);
        expect(visible(container).getAttribute("aria-hidden")).toBe("true");
        expect(screen.getByRole("status").classList.contains("screen-reader-span")).toBe(true);
    });

    test("a run of changes is announced once, after the pause", () => {
        vi.useFakeTimers();
        const [count, set_count] = createSignal<any>(0);
        const { container } = render(() => (
            <Subject
                count={count()}
                max={10}
            />
        ));
        for (const count of [1, 2, 3, 4]) {
            set_count(count);
            flush();
            act(() => vi.advanceTimersByTime(300));
        }
        expect(visible(container).textContent).toBe("4 / 10");
        expect(screen.getByRole("status").textContent).toBe("0 / 10");
        act(() => vi.advanceTimersByTime(1000));
        expect(screen.getByRole("status").textContent).toBe("4 / 10");
    });

    test("announceDelay sets the pause", () => {
        vi.useFakeTimers();
        const [count, set_count] = createSignal<any>(0);
        render(() => (
            <Subject
                count={count()}
                announceDelay={200}
            />
        ));
        set_count(7);
        flush();
        act(() => vi.advanceTimersByTime(199));
        expect(screen.getByRole("status").textContent).toBe("0");
        act(() => vi.advanceTimersByTime(1));
        expect(screen.getByRole("status").textContent).toBe("7");
    });

    test("exposes data-count, data-remaining and data-over-limit on the root", () => {
        const [count, set_count] = createSignal<any>(50);
        const { container } = render(() => (
            <Subject
                count={count()}
                max={280}
            />
        ));
        expect(root(container).getAttribute("data-count")).toBe("50");
        expect(root(container).getAttribute("data-remaining")).toBe("230");
        expect(root(container).getAttribute("data-over-limit")).toBeNull();
        set_count(300);
        flush();
        expect(root(container).getAttribute("data-over-limit")).toBe("true");
    });

    test("applies aria-label to the status", () => {
        render(() => <Subject label="Character count" />);
        expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Character count");
    });

    test("passes through additional HTML attributes", () => {
        render(() => <Subject data-testid="counter" />);
        expect(screen.getByTestId("counter").classList.contains("character-counter")).toBe(true);
    });
});
