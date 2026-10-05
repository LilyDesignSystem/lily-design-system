import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ShowMore.vue";

const base = { moreLabel: "Show more", lessLabel: "Show less" };

describe("ShowMore", () => {
    test("root is a div with the show-more class", () => {
        const { container } = render(Subject, { props: base, slots: { default: "Body" } });
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toContain("show-more");
    });

    test("collapsed by default: moreLabel, aria-expanded=false, data-expanded=false", () => {
        const { container } = render(Subject, { props: base, slots: { default: "Body" } });
        const button = screen.getByRole("button", { name: "Show more" });
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(container.querySelector(".show-more-content")!.getAttribute("data-expanded")).toBe("false");
    });

    test("content stays in the DOM and accessibility tree while collapsed", () => {
        render(Subject, { props: base, slots: { default: "Long body" } });
        expect(screen.getByText("Long body")).toBeTruthy();
    });

    test("clicking expands: lessLabel, aria-expanded=true, data-expanded=true", async () => {
        const user = userEvent.setup();
        const { container } = render(Subject, { props: base, slots: { default: "Body" } });
        await user.click(screen.getByRole("button"));
        const button = screen.getByRole("button", { name: "Show less" });
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(container.querySelector(".show-more-content")!.getAttribute("data-expanded")).toBe("true");
    });

    test("clicking again collapses", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { ...base, expanded: true }, slots: { default: "Body" } });
        await user.click(screen.getByRole("button", { name: "Show less" }));
        expect(screen.getByRole("button", { name: "Show more" }).getAttribute("aria-expanded")).toBe("false");
    });

    test("keyboard Enter and Space toggle the native button", async () => {
        const user = userEvent.setup();
        render(Subject, { props: base, slots: { default: "Body" } });
        screen.getByRole("button").focus();
        await user.keyboard("{Enter}");
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
        await user.keyboard(" ");
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("aria-controls points at the content element id", () => {
        const { container } = render(Subject, { props: base, slots: { default: "Body" } });
        const id = screen.getByRole("button").getAttribute("aria-controls")!;
        expect(id).toBeTruthy();
        expect(container.querySelector(".show-more-content")!.id).toBe(id);
    });

    test("content has no inline style", () => {
        const { container } = render(Subject, { props: base, slots: { default: "Body" } });
        expect(container.querySelector(".show-more-content")!.getAttribute("style")).toBeNull();
    });

    test("button is type=button with the show-more-button class", () => {
        render(Subject, { props: base, slots: { default: "Body" } });
        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("class")).toContain("show-more-button");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { ...base, "data-testid": "sm" }, slots: { default: "Body" } });
        expect(screen.getByTestId("sm")).toBeTruthy();
    });
});
