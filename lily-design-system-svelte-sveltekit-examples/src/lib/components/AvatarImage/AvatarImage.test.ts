import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AvatarImage from "./AvatarImage.svelte";

describe("AvatarImage", () => {
    test("renders the component", () => {
        render(AvatarImage, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
