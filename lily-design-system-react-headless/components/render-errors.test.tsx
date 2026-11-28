import { render, screen } from "@testing-library/react";
import { Component, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Button from "./Button";

// Render errors (tasks.md P50-T24): Lily catches nothing. An error thrown by a child of a Lily component reaches the
// consumer's own error boundary unchanged, and the component renders no fallback of its own.
class Boundary extends Component<
    { children: ReactNode; onError: (e: Error) => void },
    { error: Error | null }
> {
    state = { error: null as Error | null };
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    componentDidCatch(error: Error) {
        this.props.onError(error);
    }
    render() {
        return this.state.error ? (
            <p role="alert">Caught: {this.state.error.message}</p>
        ) : (
            this.props.children
        );
    }
}
function Boom(): ReactNode {
    throw new Error("child failed");
}

describe("render errors", () => {
    beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => vi.restoreAllMocks());

    test("a child's error reaches the consumer's error boundary, unchanged", () => {
        const onError = vi.fn();
        render(
            <Boundary onError={onError}>
                <Button>
                    <Boom />
                </Button>
            </Boundary>,
        );
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0].message).toBe("child failed");
        expect(screen.getByRole("alert").textContent).toBe("Caught: child failed");
        expect(screen.queryByRole("button")).toBeNull();
    });

    test("without a boundary, the error reaches the caller", () => {
        expect(() =>
            render(
                <Button>
                    <Boom />
                </Button>,
            ),
        ).toThrow("child failed");
    });
});
