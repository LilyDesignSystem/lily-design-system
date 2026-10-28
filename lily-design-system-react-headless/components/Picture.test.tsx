import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Picture from "./Picture";

const parts = (
    <>
        <source
            srcSet="wide.webp"
            media="(min-width: 800px)"
            type="image/webp"
        />
        <img
            src="small.jpg"
            alt="A lily"
            width="320"
            height="200"
        />
    </>
);

describe("Picture", () => {
    test("renders a <picture> with the base class", () => {
        const { container } = render(<Picture>{parts}</Picture>);
        expect(container.querySelector("picture.picture")).toBeTruthy();
    });

    test("puts the base class first, then the consumer class", () => {
        const { container } = render(<Picture className="mine">{parts}</Picture>);
        expect(container.querySelector("picture")!.getAttribute("class")).toBe("picture mine");
    });

    test("renders the source and img children, keeping the consumer's alt", () => {
        const { container } = render(<Picture>{parts}</Picture>);
        expect(container.querySelector("picture source")!.getAttribute("media")).toBe(
            "(min-width: 800px)",
        );
        expect(container.querySelector("picture img")!.getAttribute("alt")).toBe("A lily");
    });

    test("adds no text of its own", () => {
        const { container } = render(<Picture />);
        expect(container.querySelector("picture")!.textContent).toBe("");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Picture data-testid="subject">{parts}</Picture>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });
});
