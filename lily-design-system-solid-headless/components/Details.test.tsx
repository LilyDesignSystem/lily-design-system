import { render, screen } from "@solidjs/testing-library";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Details";

describe("Details", () => {
    test("renders summary text", () => {
        render(() => <Subject summary="Show more">Content</Subject>);
        expect(screen.getByText("Show more")).toBeTruthy();
    });

    test("is collapsed by default", () => {
        render(() => (
            <Subject
                summary="Info"
                data-testid="det"
            >
                Content
            </Subject>
        ));
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(false);
    });

    test("can be initially open", () => {
        render(() => (
            <Subject
                summary="Info"
                open
                data-testid="det"
            >
                Content
            </Subject>
        ));
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user: UserEvent = userEvent.setup();
        render(() => (
            <Subject
                summary="Toggle"
                data-testid="det"
            >
                Content
            </Subject>
        ));
        const details = screen.getByTestId("det") as HTMLDetailsElement;

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(true);

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(false);
    });

    test("renders children content", () => {
        render(() => (
            <Subject
                summary="S"
                data-testid="det"
            >
                Inner text
            </Subject>
        ));
        expect(screen.getByTestId("det").textContent).toContain("Inner text");
    });

    test("passes through attributes", () => {
        render(() => (
            <Subject
                summary="S"
                data-testid="det"
            >
                C
            </Subject>
        ));
        expect(screen.getByTestId("det")).toBeTruthy();
    });

    describe("print (P42-T9)", () => {
        const print = (name: "beforeprint" | "afterprint") => window.dispatchEvent(new Event(name));

        test("a closed disclosure opens for print and closes again afterwards", () => {
            render(() => (
                <Subject
                    summary="Info"
                    data-testid="det"
                >
                    Content
                </Subject>
            ));
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            print("beforeprint");
            expect(det.open).toBe(true);
            print("afterprint");
            expect(det.open).toBe(false);
        });

        test("one the reader had opened stays open", () => {
            render(() => (
                <Subject
                    summary="Info"
                    open
                    data-testid="det"
                >
                    Content
                </Subject>
            ));
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            print("beforeprint");
            print("afterprint");
            expect(det.open).toBe(true);
        });

        test("printOpen false leaves it closed", () => {
            render(() => (
                <Subject
                    summary="Info"
                    printOpen={false}
                    data-testid="det"
                >
                    Content
                </Subject>
            ));
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            print("beforeprint");
            expect(det.open).toBe(false);
        });

        test("stops listening once unmounted", () => {
            const { unmount } = render(() => (
                <Subject
                    summary="Info"
                    data-testid="det"
                >
                    Content
                </Subject>
            ));
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            unmount();
            print("beforeprint");
            expect(det.open).toBe(false);
        });
    });
});
