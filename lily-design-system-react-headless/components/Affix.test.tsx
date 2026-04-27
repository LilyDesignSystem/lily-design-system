import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Affix";

describe("Affix", () => {
    test("renders a div with the affix root class", () => {
        const { container } = render(<Subject>content</Subject>);

        const div: HTMLElement = container.querySelector(".affix") as HTMLElement;
        expect(div).toBeTruthy();
        expect(div.tagName).toBe("DIV");
    });

    test("renders children", () => {
        render(<Subject>hello world</Subject>);
        expect(screen.getByText("hello world")).toBeTruthy();
    });

    test("uses position: sticky inline style", () => {
        const { container } = render(<Subject>x</Subject>);

        const div: HTMLElement = container.querySelector(".affix") as HTMLElement;
        expect(div.style.position).toBe("sticky");
    });

    test("defaults to top: 0 when no offset is provided", () => {
        const { container } = render(<Subject>x</Subject>);

        const div: HTMLElement = container.querySelector(".affix") as HTMLElement;
        expect(div.style.top).toBe("0px");
    });

    test("applies offsetTop as top inline style and data-offset-top", () => {
        const { container } = render(<Subject offsetTop={16}>x</Subject>);

        const div: HTMLElement = container.querySelector(".affix") as HTMLElement;
        expect(div.style.top).toBe("16px");
        expect(div.getAttribute("data-offset-top")).toBe("16");
    });

    test("applies offsetBottom as bottom inline style and data-offset-bottom", () => {
        const { container } = render(<Subject offsetBottom={24}>x</Subject>);

        const div: HTMLElement = container.querySelector(".affix") as HTMLElement;
        expect(div.style.bottom).toBe("24px");
        expect(div.getAttribute("data-offset-bottom")).toBe("24");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject id="affix-1">x</Subject>);

        const div: HTMLElement = container.querySelector(".affix") as HTMLElement;
        expect(div.getAttribute("id")).toBe("affix-1");
    });

    test("merges consumer className", () => {
        const { container } = render(<Subject className="extra">x</Subject>);

        const div: HTMLElement = container.querySelector(".affix") as HTMLElement;
        expect(div.className.includes("affix")).toBe(true);
        expect(div.className.includes("extra")).toBe(true);
    });
});
