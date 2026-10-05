import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, test } from "vitest";

import Subject from "./ShowMore";

const base = { moreLabel: "Show more", lessLabel: "Show less" };

describe("ShowMore", () => {
    test("root is a div with the show-more class", () => {
        const { container } = render(<Subject {...base}>Body</Subject>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toContain("show-more");
    });

    test("collapsed by default: moreLabel, aria-expanded=false, data-expanded=false", () => {
        const { container } = render(<Subject {...base}>Body</Subject>);
        const button = screen.getByRole("button", { name: "Show more" });
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(container.querySelector(".show-more-content")!.getAttribute("data-expanded")).toBe("false");
    });

    test("content stays in the DOM and accessibility tree while collapsed", () => {
        render(<Subject {...base}>Long body</Subject>);
        expect(screen.getByText("Long body")).toBeTruthy();
    });

    test("clicking expands: lessLabel, aria-expanded=true, data-expanded=true", async () => {
        const user = userEvent.setup();
        const { container } = render(<Subject {...base}>Body</Subject>);
        await user.click(screen.getByRole("button"));
        const button = screen.getByRole("button", { name: "Show less" });
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(container.querySelector(".show-more-content")!.getAttribute("data-expanded")).toBe("true");
    });

    test("clicking again collapses", async () => {
        const user = userEvent.setup();
        render(<Subject {...base} expanded>Body</Subject>);
        await user.click(screen.getByRole("button", { name: "Show less" }));
        expect(screen.getByRole("button", { name: "Show more" }).getAttribute("aria-expanded")).toBe("false");
    });

    test("onChange reports the new expanded state", async () => {
        const user = userEvent.setup();
        const seen: boolean[] = [];
        render(<Subject {...base} onChange={(v) => seen.push(v)}>Body</Subject>);
        await user.click(screen.getByRole("button"));
        await user.click(screen.getByRole("button"));
        expect(seen).toEqual([true, false]);
    });

    test("keyboard Enter and Space toggle the native button", async () => {
        const user = userEvent.setup();
        render(<Subject {...base}>Body</Subject>);
        screen.getByRole("button").focus();
        await user.keyboard("{Enter}");
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
        await user.keyboard(" ");
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("aria-controls points at the content element id", () => {
        const { container } = render(<Subject {...base}>Body</Subject>);
        const id = screen.getByRole("button").getAttribute("aria-controls")!;
        expect(id).toBeTruthy();
        expect(container.querySelector(".show-more-content")!.id).toBe(id);
    });

    test("content has no inline style", () => {
        const { container } = render(<Subject {...base}>Body</Subject>);
        expect(container.querySelector(".show-more-content")!.getAttribute("style")).toBeNull();
    });

    test("button is type=button with the show-more-button class", () => {
        render(<Subject {...base}>Body</Subject>);
        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("class")).toContain("show-more-button");
    });

    test("passes through attributes", () => {
        render(<Subject {...base} data-testid="sm">Body</Subject>);
        expect(screen.getByTestId("sm")).toBeTruthy();
    });
});
