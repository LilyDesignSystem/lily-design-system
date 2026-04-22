import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Option from "./Option.svelte";

describe("Option", () => {
    test("renders the component", () => {
        render(Option, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
