import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ActionLink.vue";

// Svelte 5 snippets are functions that receive an anchor node and insert DOM nodes before it.

describe("ActionLink", () => {
    test("renders as a link with href", () => {
        render(Subject, { props: { href: "/example" }, slots: { default: "Go to example" } });

        const link: HTMLElement = screen.getByRole("link", { name: "Go to example" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/example");
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, {
            props: { href: "/next", label: "Navigate to next section" },
            slots: { default: "Next" },
        });

        const link: HTMLElement = screen.getByRole("link", { name: "Navigate to next section" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("aria-label")).toBe("Navigate to next section");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(Subject, { props: { href: "/test" }, slots: { default: "Test link" } });

        const link: HTMLElement = screen.getByRole("link", { name: "Test link" });
        expect(link.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { href: "/ext", target: "_blank", rel: "noopener noreferrer" },
            slots: { default: "External" },
        });

        const link: HTMLElement = screen.getByRole("link", { name: "External" });
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { href: "/keyboard" }, slots: { default: "Keyboard nav" } });

        const link: HTMLElement = screen.getByRole("link", { name: "Keyboard nav" });
        await user.tab();
        expect(document.activeElement).toBe(link);
    });
});
