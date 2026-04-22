import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EmailLink from "./EmailLink.svelte";

describe("EmailLink", () => {
    test("renders the component", () => {
        render(EmailLink, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
