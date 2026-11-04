import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import WarningText from "./WarningText";

const text = (
    <>
        <span className="screen-reader-span">Warning</span> You can be fined if you do not register.
    </>
);

describe("WarningText", () => {
    test("renders a <div> with the base class", () => {
        const { container } = render(<WarningText>{text}</WarningText>);
        expect(container.querySelector("div.warning-text")).toBeTruthy();
    });

    test("puts the base class first, then the consumer class", () => {
        const { container } = render(<WarningText className="mine">{text}</WarningText>);
        expect(container.querySelector(".warning-text")!.getAttribute("class")).toBe(
            "warning-text mine",
        );
    });

    test("renders the children, hidden prefix included, inside strong.warning-text-text", () => {
        const { container } = render(<WarningText>{text}</WarningText>);
        const strong = container.querySelector(".warning-text > strong.warning-text-text")!;
        expect(strong.querySelector(".screen-reader-span")!.textContent).toBe("Warning");
        expect(strong.textContent).toContain("You can be fined");
    });

    test("renders a supplied icon first, inside an aria-hidden wrapper", () => {
        const { container } = render(<WarningText icon="!">{text}</WarningText>);
        const wrap = container.querySelector(".warning-text > .warning-text-icon")!;
        expect(wrap.getAttribute("aria-hidden")).toBe("true");
        expect(wrap.textContent).toBe("!");
        expect(container.querySelector(".warning-text")!.firstElementChild).toBe(wrap);
    });

    test("renders no icon wrapper when no icon is supplied", () => {
        const { container } = render(<WarningText>{text}</WarningText>);
        expect(container.querySelector(".warning-text-icon")).toBeNull();
    });

    test("adds no role and no text of its own", () => {
        const { container } = render(<WarningText>{null}</WarningText>);
        const root = container.querySelector(".warning-text")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.textContent).toBe("");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<WarningText data-testid="subject">{text}</WarningText>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });
});
