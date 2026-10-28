import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AvatarImage";

describe("AvatarImage", () => {
    test("renders an img element", () => {
        render(
            <Subject
                src="/photo.jpg"
                alt="Jane Doe"
            />,
        );
        expect(screen.getByAltText("Jane Doe")).toBeTruthy();
    });

    test("has correct src", () => {
        render(
            <Subject
                src="/photos/jane.jpg"
                alt="Jane Doe"
            />,
        );
        expect(screen.getByAltText("Jane Doe").getAttribute("src")).toBe("/photos/jane.jpg");
    });

    test("is aria-hidden", () => {
        render(
            <Subject
                src="/photo.jpg"
                alt="Jane Doe"
            />,
        );
        expect(screen.getByAltText("Jane Doe").getAttribute("aria-hidden")).toBe("true");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                src="/photo.jpg"
                alt="Jane"
                data-testid="aci"
            />,
        );
        expect(screen.getByTestId("aci")).toBeTruthy();
    });
});
