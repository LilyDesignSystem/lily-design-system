import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";

import Subject from "../../components/ContentsLink.vue";

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

describe("ContentsLink count", () => {
    const mount = (props: Record<string, unknown>, text = "x") =>
        render(Subject, { props: { href: "#a", ...props }, slots: { default: text } });
    const anchor = () => document.querySelector("a.contents-link") as HTMLElement;

    test("countLabel renders inside the link, so the link's name includes it", () => {
        mount({ count: 3, countLabel: "3 to do" }, "Address");
        expect(document.querySelector(".contents-link-count")!.textContent).toBe("3 to do");
        expect(screen.getByRole("link", { name: /Address.*3 to do/ })).toBeTruthy();
    });

    test("no countLabel renders no count element", () => {
        mount({ count: 3 }, "Address");
        expect(document.querySelector(".contents-link-count")).toBeNull();
    });

    test("count sets data-count; zero adds data-complete", () => {
        mount({ count: 3 });
        expect(anchor().getAttribute("data-count")).toBe("3");
        expect(anchor().hasAttribute("data-complete")).toBe(false);
    });

    test("a count of 0 sets data-count=0 and data-complete", () => {
        mount({ count: 0 });
        expect(anchor().getAttribute("data-count")).toBe("0");
        expect(anchor().hasAttribute("data-complete")).toBe(true);
    });

    test("no count sets neither data attribute", () => {
        mount({});
        expect(anchor().hasAttribute("data-count")).toBe(false);
        expect(anchor().hasAttribute("data-complete")).toBe(false);
    });
});
