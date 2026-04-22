import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AvatarText from "./AvatarText.svelte";

describe("AvatarText", () => {
    test("renders the component", () => {
        render(AvatarText, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
