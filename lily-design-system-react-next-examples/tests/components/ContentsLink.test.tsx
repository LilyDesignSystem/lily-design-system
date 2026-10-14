import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "@lily/ContentsLink";

describe("ContentsLink", () => {
    test("renders an anchor with href", () => {
        render(<Subject href="/x">Click</Subject>);
        const link = screen.getByRole("link", { name: "Click" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/x");
    });

    test("applies class contents-link", () => {
        render(<Subject href="/x">Click</Subject>);
        const link = screen.getByRole("link");
        expect(link.getAttribute("class")).toContain("contents-link");
    });

    test("applies aria-label when label prop is provided", () => {
        render(<Subject href="/x" label="More info">Click</Subject>);
        const link = screen.getByRole("link", { name: "More info" });
        expect(link.getAttribute("aria-label")).toBe("More info");
    });

    test("does not set aria-label when label prop is omitted", () => {
        render(<Subject href="/x">Click</Subject>);
        const link = screen.getByRole("link");
        expect(link.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject href="/x" data-testid="link">Click</Subject>);
        expect(screen.getByTestId("link")).toBeTruthy();
    });
});

describe("ContentsLink count", () => {
    test("countLabel renders inside the link, so the link's name includes it", () => {
        const { container } = render(<Subject href="#a" count={3} countLabel="3 to do">Address</Subject>);
        expect(container.querySelector(".contents-link-count")!.textContent).toBe("3 to do");
        expect(screen.getByRole("link", { name: /Address.*3 to do/ })).toBeTruthy();
    });

    test("no countLabel renders no count element", () => {
        const { container } = render(<Subject href="#a" count={3}>Address</Subject>);
        expect(container.querySelector(".contents-link-count")).toBeNull();
    });

    test("count sets data-count; zero adds data-complete; none sets neither", () => {
        const three = render(<Subject href="#a" count={3}>x</Subject>).container.querySelector("a")!;
        expect(three.getAttribute("data-count")).toBe("3");
        expect(three.hasAttribute("data-complete")).toBe(false);
        const zero = render(<Subject href="#a" count={0}>x</Subject>).container.querySelector("a")!;
        expect(zero.getAttribute("data-count")).toBe("0");
        expect(zero.hasAttribute("data-complete")).toBe(true);
        const none = render(<Subject href="#a">x</Subject>).container.querySelector("a")!;
        expect(none.hasAttribute("data-count")).toBe(false);
        expect(none.hasAttribute("data-complete")).toBe(false);
    });
});
