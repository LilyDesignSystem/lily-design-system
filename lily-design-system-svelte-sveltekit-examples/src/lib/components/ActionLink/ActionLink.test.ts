import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ActionLink from "./ActionLink.svelte";

describe("ActionLink", () => {
    test("renders the component", () => {
        render(ActionLink, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
