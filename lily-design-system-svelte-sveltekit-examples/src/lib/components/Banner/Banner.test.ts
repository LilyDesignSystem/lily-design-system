import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Banner from "./Banner.svelte";

describe("Banner", () => {
    test("renders the component", () => {
        render(Banner, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
