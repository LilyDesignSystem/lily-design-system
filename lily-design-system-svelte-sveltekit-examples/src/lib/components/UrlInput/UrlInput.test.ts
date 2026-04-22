import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import UrlInput from "./UrlInput.svelte";

describe("UrlInput", () => {
    test("renders the component", () => {
        render(UrlInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
