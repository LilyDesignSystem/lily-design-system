import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Header from "./Header.svelte";

describe("Header", () => {
    test("renders the component", () => {
        render(Header, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
