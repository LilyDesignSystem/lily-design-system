import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TelLink from "./TelLink.svelte";

describe("TelLink", () => {
    test("renders the component", () => {
        render(TelLink, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
