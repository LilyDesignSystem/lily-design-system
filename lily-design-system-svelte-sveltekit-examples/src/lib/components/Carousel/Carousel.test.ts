import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Carousel from "./Carousel.svelte";

describe("Carousel", () => {
    test("renders the component", () => {
        render(Carousel, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
