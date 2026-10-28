import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Collapsible.vue";

describe("Collapsible", () => {
    test("renders summary text", () => {
        render(Subject, { props: { summary: "Show more" }, slots: { default: "Hidden content" } });

        expect(screen.getByText("Show more")).toBeTruthy();
    });

    test("is collapsed by default", () => {
        render(Subject, {
            props: { summary: "Details", "data-testid": "details" },
            slots: { default: "Content" },
        });

        const details = screen.getByTestId("details") as HTMLDetailsElement;
        expect(details.open).toBe(false);
    });

    test("can be initially open", () => {
        render(Subject, {
            props: { summary: "Details", open: true, "data-testid": "details" },
            slots: { default: "Visible content" },
        });

        const details = screen.getByTestId("details") as HTMLDetailsElement;
        expect(details.open).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { summary: "Toggle me", "data-testid": "details" },
            slots: { default: "Content" },
        });

        const summary = screen.getByText("Toggle me");
        const details = screen.getByTestId("details") as HTMLDetailsElement;

        await user.click(summary);
        expect(details.open).toBe(true);

        await user.click(summary);
        expect(details.open).toBe(false);
    });

    test("summary element is focusable", () => {
        render(Subject, {
            props: { summary: "Focus me", "data-testid": "det" },
            slots: { default: "Content" },
        });

        // jsdom doesn't tab to <summary>, so focus it directly.
        const summary = screen.getByTestId("det").querySelector("summary") as HTMLElement;
        summary.focus();
        expect(document.activeElement).toBe(summary);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { summary: "Info", "data-testid": "coll" },
            slots: { default: "Content" },
        });

        expect(screen.getByTestId("coll")).toBeTruthy();
    });
});
