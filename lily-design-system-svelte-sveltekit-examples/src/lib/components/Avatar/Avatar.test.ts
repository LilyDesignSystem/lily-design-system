import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Avatar from "./Avatar.svelte";

describe("Avatar", () => {
    test("renders the component", () => {
        render(Avatar, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
