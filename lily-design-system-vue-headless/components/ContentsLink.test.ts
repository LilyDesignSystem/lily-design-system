import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";

import Subject from "./ContentsLink.vue";

describe("ContentsLink", () => {
    test("renders an anchor with href", () => {
        render(Subject, { props: { href: "/x" }, slots: { default: "Click" } });
        const link = screen.getByRole("link", { name: "Click" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/x");
    });

    test("applies class contents-link", () => {
        render(Subject, { props: { href: "/x" }, slots: { default: "Click" } });
        const link = screen.getByRole("link");
        expect(link.getAttribute("class")).toContain("contents-link");
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: { href: "/x", label: "More info" }, slots: { default: "Click" } });
        expect(screen.getByRole("link").getAttribute("aria-label")).toBe("More info");
    });

    test("does not set aria-label when label prop is omitted", () => {
        render(Subject, { props: { href: "/x" }, slots: { default: "Click" } });
        expect(screen.getByRole("link").getAttribute("aria-label")).toBeNull();
    });
});
