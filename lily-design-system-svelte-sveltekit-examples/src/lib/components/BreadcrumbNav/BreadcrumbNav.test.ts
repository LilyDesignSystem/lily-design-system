import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BreadcrumbNav from "./BreadcrumbNav.svelte";

describe("BreadcrumbNav", () => {
    test("renders the component", () => {
        render(BreadcrumbNav, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
