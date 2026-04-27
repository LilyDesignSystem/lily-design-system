import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ValidationList.vue";


describe("ValidationList", () => {
    test("renders a ul element", () => {
        const { container } = render(Subject, {
            props: { label: "Password rules" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul).toBeTruthy();
    });

    test("has validation-list class on root", () => {
        const { container } = render(Subject, {
            props: { label: "Password rules" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.classList.contains("validation-list")).toBe(true);
    });

    test("applies aria-label from prop", () => {
        const { container } = render(Subject, {
            props: { label: "Password rules" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("aria-label")).toBe("Password rules");
    });

    test("uses aria-live polite", () => {
        const { container } = render(Subject, {
            props: { label: "Password rules" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("aria-live")).toBe("polite");
    });

    test("renders children from slot", () => {
        const { container } = render(Subject, {
            props: { label: "Password rules" },
            slots: { default: "<li>One</li><li>Two</li>" },
        });

        const items: NodeListOf<HTMLElement> = container.querySelectorAll("li");
        expect(items.length).toBe(2);
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { label: "Password rules", id: "rules" },
            slots: { default: "<li>One</li>" },
        });

        const ul: HTMLElement | null = container.querySelector("ul");
        expect(ul?.getAttribute("id")).toBe("rules");
    });
});
