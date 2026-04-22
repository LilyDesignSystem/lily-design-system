import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Splitter from "./Splitter.svelte";

describe("Splitter", () => {
    test("renders the component", () => {
        render(Splitter, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
