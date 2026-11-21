import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Details.vue";

describe("Details", () => {
    test("renders summary text", () => {
        render(Subject, { props: { summary: "Show more" }, slots: { default: "Content" } });
        expect(screen.getByText("Show more")).toBeTruthy();
    });

    test("is collapsed by default", () => {
        render(Subject, {
            props: { summary: "Info", "data-testid": "det" },
            slots: { default: "Content" },
        });
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(false);
    });

    test("can be initially open", () => {
        render(Subject, {
            props: { summary: "Info", open: true, "data-testid": "det" },
            slots: { default: "Content" },
        });
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { summary: "Toggle", "data-testid": "det" },
            slots: { default: "Content" },
        });
        const details = screen.getByTestId("det") as HTMLDetailsElement;

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(true);

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(false);
    });

    test("renders children content", () => {
        render(Subject, {
            props: { summary: "S", "data-testid": "det" },
            slots: { default: "Inner text" },
        });
        expect(screen.getByTestId("det").textContent).toContain("Inner text");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { summary: "S", "data-testid": "det" }, slots: { default: "C" } });
        expect(screen.getByTestId("det")).toBeTruthy();
    });

    describe("print (P42-T9)", () => {
        const print = (name: "beforeprint" | "afterprint") => window.dispatchEvent(new Event(name));
        const slots = { default: "Content" };

        test("a closed disclosure opens for print and closes again afterwards", () => {
            render(Subject, { props: { summary: "Info", "data-testid": "det" }, slots });
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            print("beforeprint");
            expect(det.open).toBe(true);
            print("afterprint");
            expect(det.open).toBe(false);
        });

        test("one the reader had opened stays open", () => {
            render(Subject, {
                props: { summary: "Info", open: true, "data-testid": "det" },
                slots,
            });
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            print("beforeprint");
            print("afterprint");
            expect(det.open).toBe(true);
        });

        test("printOpen false leaves it closed", () => {
            render(Subject, {
                props: { summary: "Info", printOpen: false, "data-testid": "det" },
                slots,
            });
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            print("beforeprint");
            expect(det.open).toBe(false);
        });

        test("stops listening once unmounted", () => {
            const { unmount } = render(Subject, {
                props: { summary: "Info", "data-testid": "det" },
                slots,
            });
            const det = screen.getByTestId("det") as HTMLDetailsElement;
            unmount();
            print("beforeprint");
            expect(det.open).toBe(false);
        });
    });
});
